# PyInvoice

A tool to generate nicely formatted and LaTeX generated invoices.

## How to install?

just run:

    python3 setup.py install

## How to develop?

    pip3 install zc.buildout
    buildout

you'll find the tool in:

    bin/pyinvoice

## External dependency

you need to make sure you have installed the texlive suite, along with
the `pdflatex` tool. No special LaTeX library is needed.

## How to use?

create a directory such as `paperwork`, within it create two files:

`invoices_config.yaml`:

that will contain the name of the template (`format` key) the path to the pdflatex tool,
and in `source` all the custom information for your billing.

```
format: french
source:
    name: Ford Prefect
    address:
        - Hyperspace bypass
        - Earth
    telephone: +44 777 7777 7777
    website: http://mostly.harmless.com
    email: ford.prefect@mostly.harmless.com
    siren: 111 222 333
    ape: 9602A
    bank:
        rib:
            - 00001
            - 00002
            - 00000000001
            - 42
        iban: FR42 0000 1000 0200 0000 0000 142
        bics: FOOBARFUBAR
tools:
    pdflatex: /usr/local/texlive/2014/bin/universal-darwin/pdflatex
```

`invoices_list.yaml`:

that will contain a list of `!invoice` objects. The `iid` will be the unique reference
of the invoice. Then all the elements are as defined by the template.


```
- !invoice
  iid: 201410-001
  date: 2014-10-02
  kind: paid
  customer: !customer
    address: [Alpha du centaure]
    name: Zaphod Beeblebrox
  subject: Voyage en dauphin
  desc: "Pr\xE9paration et embarquation sur un dauphin \xE0 travers les mers"
  place: Babylon
  products:
  - !product
    descr: Soutien psychologique du dauphin
    price: 430
    qty: 1
  - !offer
    descr: Discount because I'm nice
    price: 20
    qty: 1
```

## How to run?

To generate all your invoices, in the `paperwork` directory:

    pyinvoice -d paperwork generate

If you want your tax calculation:

    pyinvoice -d paperwork results quarterly
    pyinvoice -d paperwork results yearly

And finally, to launch the webapp, use 

    pyinvoice -d paperwork api

If you've made a change to an invoice and need to regenerate, just remove
the pdf file!


## How will it look like?

here's a shot of one of the example invoices:

![IV201410-001.pdf](https://github.com/guyzmo/pyinvoice/blob/master/examples/IV201410-001.pdf.png)

