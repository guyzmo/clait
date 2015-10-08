#!/usr/bin/env python

"""
generate invoices

Usage:
    invoice.py [--verbose] --config=<config> <invoices> print
    invoice.py [--verbose] --config=<config> <invoices> generate [--output=<output>]
    invoice.py [--verbose] --config=<config> <invoices> results quarterly
    invoice.py [--verbose] --config=<config> <invoices> results yearly
    invoice.py [--verbose] --config=<config> <invoices> save

Parameters:
    <invoices>          set list of invoices.
    --config=<config>   Setup config file.
    --output=<output>   Directory to generate the files to. [default: ./]
    -v,--verbose        Set verbose output.
    -h,--help           This message.
    -V,--version        Show version.

Commands:
    print               Output a formalised list of invoices.
    generate            Output all invoices as pdf.
    results quarterly   Calculate quarterly results.
    results yearly      Calculate yearly results.
    save                Save ...
"""

import os
import sys
import yaml
import copy
import docopt
import shutil
import tempfile
import datetime
import subprocess

from .format import french as FORMAT

### Errors

class InputError(Exception):
    def __init__(self, item, key, f, kind):
        super(InputError, self).__init__(
            "Missing key {} in item {} in given {} input '{}'.".format(
                key,
                '#{}'.format(item) if isinstance(item, int) else "'{}'".format(item),
                f,
                kind,
            )
        )
        self.item = item
        self.key = key
        self.file = f


class ConfigurationError(InputError):
    def __init__(self, item, key, f):
        super(ConfigurationError, self).__init__(item, key, 'configuration', f)


class InvoiceError(InputError):
    def __init__(self, item, key, f):
        super(InvoiceError, self).__init__(item, key, 'invoice', f)


### Yaml output

class YamlObject(yaml.YAMLObject):
    yaml_hidden_fields = []
    yaml_flow_style = False

    @classmethod
    def to_yaml(cls,dumper,data):
        new_data = copy.deepcopy(data)
        for item in cls.yaml_hidden_fields:
            del new_data.__dict__[item]
        return dumper.represent_yaml_object(cls.yaml_tag,
                                            new_data,
                                            cls,
                                            flow_style=cls.yaml_flow_style)

class Customer(YamlObject):
    yaml_tag = u'!customer'
    def __init__(self, name, address):
        self.name = name
        self.address = address

    def __repr__(self):
        return 'Customer<{name}>'.format(**self.__dict__)

    def __str__(self):
        formatting = {}
        formatting.update(self.__dict__)
        formatting['address'] = "\\newline\n".join(formatting['address'])
        return FORMAT.CUSTOMER.format(**formatting)


class Product(YamlObject):
    yaml_tag = u'!product'
    def __init__(self, descr, quantity, price):
        self.descr = descr
        self.qty = quantity
        self.price = price

    def __repr__(self):
        return 'Product<{descr},{qty},{price}>'.format(**self.__dict__)

    def __str__(self):
        return FORMAT.PRODUCT.format(**self.__dict__)


class Invoice(YamlObject):
    yaml_tag = u'!invoice'
    yaml_hidden_fields = ['_header', '_footer']
    date_counter = {}

    def __init__(self, kind, date, place, subject, descr, customer, products, header, footer):
        self._header = header
        self._footer = footer
        self.kind = kind
        self.date = date
        self.place = place
        self.subject = subject
        self.desc = descr
        self.customer = Customer(**customer)
        self.products = [Product(**p) for p in products.values()]
        self.iid = self.get_invoice_id()

    def __repr__(self):
        return 'Invoice<{iid},{date},{kind},{place},{subject:30},{customer!r},{}>'.format(self.get_total(), **self.__dict__)

    def get_invoice_id(self):
        date = self.date.strftime("%Y%m")
        self.date_counter[date] = self.date_counter.get(date, 0) + 1
        return "{}-{:03d}".format(date, self.date_counter[date])

    def get_total(self):
        total = 0
        for p in self.products:
            total += p.price * p.qty
        return total

    def __str__(self):
        formatting = {}
        formatting.update(self.__dict__)
        formatting['products'] = "\n".join([str(p) for p in formatting['products']])
        return FORMAT.INVOICE.format(**formatting)


class Accounting:
    def __init__(self, config, output='./', verbose=False):
        self.invoices = []
        self._verbose = verbose
        self._output = output
        self._header = FORMAT.HEADER
        self._footer = FORMAT.FOOTER
        self.load_config(config)

    def load_config(self, c):
        def format_from(config):
            formatting = {}
            formatting.update(config['source'])
            formatting['rib'] = " & ".join([str(i) for i in config['source']['bank']['rib']])
            formatting['iban'] = config['source']['bank']['iban']
            formatting['bics'] = config['source']['bank']['bics']
            formatting['address'] = "\\newline\n".join(config['source']['address'])
            return formatting
        with open(c, 'r') as fcf:
            self.config = yaml.load(fcf)
            try:
                self._footer = self._footer.format(**format_from(self.config))
            except Exception as err:
                raise ConfigurationError('source', err.args[0].split(': ')[1], c)

    def load_invoices(self, f):
        self._invoice_file = f
        invoices = []
        try:
            idx = 0
            with open(f, 'r') as fin:
                invoice_list = yaml.load(fin)
                self.invoices = []
                for i in invoice_list['invoices']:
                    self.invoices.append(
                        Invoice(
                            header=self._header,
                            footer=self._footer,
                            **i['invoice']
                        )
                    )
                    idx += 1
        except TypeError as err:
            raise InvoiceError(idx, err.args[0].split(': ')[1], f)

    def append(self, i):
        self.invoices.append(i)

    def save(self, fout='output.yaml'):
        with open(fout, 'w') as f:
            f.write(yaml.dump(self.invoices))

    def generate_pdf(self):
        ret = False
        with tempfile.TemporaryDirectory() as workdir:
            stdout=subprocess.DEVNULL
            stderr=subprocess.DEVNULL
            interaction='batchmode'
            for invoice in self.invoices:
                fin_path = os.path.join(self._output, 'IV{}.tex'.format(invoice.iid))
                fout_path = os.path.join(self._output, 'IV{}.pdf'.format(invoice.iid))
                flog_path = os.path.join(self._output, 'IV{}.log'.format(invoice.iid))
                fin_temp_path = os.path.join(workdir, 'IV{}.tex'.format(invoice.iid))
                fout_temp_path = os.path.join(workdir, 'IV{}.pdf'.format(invoice.iid))
                flog_temp_path = os.path.join(workdir, 'IV{}.log'.format(invoice.iid))
                if not os.path.exists(fout_path):
                    print("Generating invoice '{}': ".format(fout_path), end='')
                    sys.stdout.flush()
                    with open(fin_temp_path, 'w') as fin:
                        fin.write(str(invoice))
                    parameters = [self.config['tools']['pdflatex'],
                                    '-interaction={}'.format(interaction),
                                    '-file-line-error',
                                    '-halt-on-error',
                                    fin_temp_path]
                    if self._verbose:
                        stdout = None
                        stderr = None
                        interaction='nonstopmode'
                        print("\n → {}".format(" ".join(parameters)))
                    if subprocess.call(parameters,
                                        stdout=stdout,
                                        stderr=stderr,
                                        cwd=workdir) == 0:
                        shutil.copy(fout_temp_path, self._output)
                        print('✔︎')
                        ret = True
                    else:
                        shutil.copy(flog_temp_path, self._output)
                        print("‼️\nCheck log file: '{}'".format(flog_path))
        return ret

    def calculate_quarterly(self):
        quarters = {}
        for i in self.invoices:
            q = int((i.date.month-1)/3+1)
            quarters[(i.date.year, q)] = quarters.get((i.date.year, q), 0) + i.get_total()
        return quarters

    def calculate_yearly(self):
        years = {}
        for i in self.invoices:
            years[i.date.year] = years.get(i.date.year, 0) + i.get_total()
        return years


def cli():
    args = docopt.docopt(__doc__)
    print(args)
    try:
        acct = Accounting(
            config=args['--config'],
            verbose=args['--verbose'],
            output=args['--output']
        )
        acct.load_invoices(args['<invoices>'])

        if args['generate']:
            if not acct.generate_pdf():
                print('Nothing generated')

        if args['print']:
            print("Invoices:")

            for i in acct.invoices:
                print(repr(i))

        if args['results'] and args['quarterly']:
            print("Quartely results:")

            for quarter, value in sorted(acct.calculate_quarterly().items()):
                print('', quarter[0], 'Q{}'.format(quarter[1]), value)

        if args['results'] and args['yearly']:
            print("Yearly results:")

            for year, value in acct.calculate_yearly().items():
                print('', year, value)

        if args['save']:
            acct.save()
    except InputError as ierr:
        print(ierr)


def __main__(self):
    cli()


