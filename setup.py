from setuptools import setup, find_packages


setup(name='pyinvoice',
      version='0.0',
      description='',
      long_description='',
      classifiers=[
          'Development Status :: 2 - Pre-Alpha',
          'License :: OSI Approved :: MIT License',
      ],
      keywords='',
      url='',
      author='',
      author_email='',
      install_requires=[
          'docopt',
      ],
      entry_points="""
      # -*- Entry points: -*-
      [console_scripts]
      pyinvoice = invoice.invoice:cli
      """,
      license='WTFPL',
      packages=find_packages(),
      test_suite='nose.collector',
      tests_require=['nose'],
      zip_safe=False)
