#!/usr/bin/env python
"""
generate invoices

Usage:
    restful.py [--verbose] --config=<config> <invoices>

Parameters:
    <invoices>          set list of invoices.
    --config=<config>   Setup config file.
    --output=<output>   Directory to generate the files to. [default: ./]
    -v,--verbose        Set verbose output.
    -h,--help           This message.
    -V,--version        Show version.

"""

import os

from flask import Flask, request, make_response, send_from_directory
from flask_restful import Resource, Api

from flask.ext.bower import Bower

import invoice

def build_api(acct, args=None):
    app = Flask('pyinvoice')
    api = Api(app)

    app.config['BOWER_COMPONENTS_ROOT'] = 'static/bower_components'
    app.config['BOWER_URL_PREFIX'] = '/bower_components'

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
        return make_response(open(os.path.join(app.root_path,
                                            'static/app/index.html')).read())

    @app.route('/scripts/<script>')
    def scripts(script, **kwargs):
        return send_from_directory('static/app/scripts', script)

    @app.route('/scripts/controllers/<script>')
    def controllers(script, **kwargs):
        return send_from_directory('static/app/scripts/controllers/', script)

    @app.route('/views/<view>')
    def views(view, **kwargs):
        return send_from_directory('static/app/views', view)

    @app.route('/images/<img>')
    def images(img, **kwargs):
        return send_from_directory('static/app/images', img)

    @app.route('/styles/<style>')
    def styles(style, **kwargs):
        return send_from_directory('static/app/styles', style)


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
