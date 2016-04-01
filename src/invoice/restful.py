#!/usr/bin/env python
"""
generate invoices

Usage:
    restful.py [-v] --config=<config> <invoices>

Parameters:
    <invoices>             set list of invoices.
    -c,--config=<config>   Setup config file.
    -o,--output=<output>   Directory to generate the files to. [default: ./]
    -v,--verbose           Set verbose output.
    -h,--help              This message.
    -V,--version           Show version.

"""

import os

from flask import Flask, request, render_template, make_response, send_from_directory
from flask_restful import Resource, Api

from flask.ext.assets import Bundle, Environment
from flask.ext.bower import Bower

import jinja2

import invoice


def Template(app, path):
    loader = jinja2.ChoiceLoader([
        app.jinja_loader,
        jinja2.FileSystemLoader(path),
    ])
    app.jinja_loader = loader


def build_api(acct, args=None):
    app = Flask('pyinvoice', static_folder='src/static')
    api = Api(app)

    Template(app, 'src/templates')

    app.config["REQUIREJS_BIN"] = 'node_modules/requirejs/bin/r.js'
    app.config["REQUIREJS_CONFIG"] = 'build.js'
    app.config["REQUIREJS_RUN_IN_DEBUG"] = False

    if args['--verbose']:
        app.config["ASSETS_DEBUG"] = True

    assets = Environment(app)
    assets.set_directory('src/static/scripts/js')
    assets.set_url('/')

    app.config['BOWER_COMPONENTS_ROOT'] = 'src/static/scripts/js/vendors'
    app.config['BOWER_URL_PREFIX'] = '/vendors'

    Bower(app)

    class AccountResults(Resource):
        def get(self):
            return {
                'yearly': acct.calculate_yearly(),
                'quarterly': acct.calculate_quarterly(),
                'monthly': acct.calculate_monthly(),
            }


    class InvoiceList(Resource):
        def get(self):
            return acct.invoices

        def post(self):
            args = parser.parse_args()
            i = invoice.Invoice(**args)
            acct.append(i)
            acct.save()
            return i, 201


    class Invoice(Resource):
        def get(self, invoice_id, action='show'):
            print(invoice_id, action)
            if invoice_id.startswith("IV"):
                invoice_id = invoice_id[2:]
            invoice = acct.get_invoice(invoice_id)
            if not invoice:
                raise Exception("Invoice {} not found.".format(invoice_id))
            if action == 'show':
                return invoice
            elif action == 'download':
                acct.generate_pdf()
                return send_from_directory(acct._output,
                                           'IV{}.pdf'.format(invoice_id))

        def put(self, invoice_id):
            invoice = acct.get_invoice(invoice_id)
            if not invoice:
                    raise Exception("Invoice {} not found.".format(invoice_id))

            data = request.form['data']
            for key, value in data.items():
                if not getattr(invoice, key):
                    raise Exception("Key {} not found in {}".format(key, invoice))
                else:
                    setattr(invoice, key, value)
            acct.save()
            return invoice

        def post(self, invoice_id):
            invoice = Invoice(**request.form['data'])
            acct.append(invoice)
            acct.save()
            return invoice


    api.add_resource(AccountResults, '/results')
    api.add_resource(InvoiceList, '/invoices', )
    api.add_resource(Invoice,
                     '/invoices/<string:invoice_id>',
                     '/invoices/<string:invoice_id>/<string:action>')

    @app.route('/')
    def basic_pages(**kwargs):
        return render_template('index.html')
        #return make_response(open(os.path.join(app.root_path,
        #                                   'src/static/index.html')).read())

    @app.route('/scripts/<path:script_path>')
    def scripts(script_path, **kwargs):
        return send_from_directory('src/static/scripts', script_path)

#     @app.route('/scripts/controllers/<script>')
#     def controllers(script, **kwargs):
#         return send_from_directory('src/static/scripts/controllers/', script)

    # @app.route('/views/<view>')
    # def views(view, **kwargs):
    #     return send_from_directory('src/static/views', view)

    @app.route('/images/<img>')
    def images(img, **kwargs):
        return send_from_directory('src/static/images', img)

    @app.route('/styles/<style>')
    def styles(style, **kwargs):
        return send_from_directory('src/static/styles', style)


    app.run(debug=args['--verbose'])

if __name__ == '__main__':
    args = docopt.docopt(__doc__)

    acct = Accounting(
        config=args['--config'],
        verbose=args['--verbose'],
        output=args['--output']
    )
    acct.load(args['<invoices>'])

    build_api()
