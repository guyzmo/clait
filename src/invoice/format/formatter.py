#!/usr/bin/env python

from types import SimpleNamespace

_templates = dict()

template_keys = {'INVOICE', 'PRODUCT', 'OFFER', 'CUSTOMER', 'HEADER', 'FOOTER'}

def register_template(name, template):
    _templates[name] = template

def load(name):
    return SimpleNamespace(**_templates[name])

# autoload all templates

from .templates import *

