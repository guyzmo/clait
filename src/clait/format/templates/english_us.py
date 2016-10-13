#!/usr/bin/env python

from ..formatter import register_template

# expected in source:

'''
source:
    name:
    address:
    telephone:
    website:
    email:
    firm_number:
    SIC: (nature of business)
    bank:
        sort_code:
        account_number:
        iban:
        bics:
'''

register_template('english_uk', dict(
    INVOICE = """
{HEADER}

\def\InvoiceId          {{{iid}}}
\def\InvoiceKind        {{{kind}}}
\def\InvoicePlace       {{{place}}}
\def\InvoiceSubject     {{{subject}}}
\def\InvoiceDescr {{
{desc}
}}

{customer}

{products}

{FOOTER}
""",

    PRODUCT = """\
\AddProduct {{{descr}}}        {{{qty}}}        {{{price}}}
""",

    OFFER = """\
\SubProduct {{{descr}}}        {{{qty}}}        {{{price}}}
""",

    CUSTOMER = """\
\def\ClientName{{{name}}}
\def\ClientAddr{{{address}}}
""",

    HEADER = r"""
\documentclass[english,11pt]{article}
\usepackage{babel}
\usepackage[utf8]{inputenc}
\usepackage[a4paper]{geometry}
\usepackage{units}
\usepackage{graphicx}
\usepackage{fancyhdr}
\usepackage{fp}

\def\VAT{20.6}    % VAT value

\def\TotalExclVAT{0}
\def\TotalVAT{0}

\newcommand{\AddProduct}[3]{
    % Arguments : Description, quantity, Excl-VAT Unit Price
    \FPround{\prix}{#3}{2}
    \FPeval{\amount}{#2 * #3}
    \FPround{\amount}{\amount}{2}
    \FPadd{\TotalExclVAT}{\TotalExclVAT}{\amount}

    \eaddto\ProductsList{#1    &    \prix    &    #2    &    \amount    \cr}
}

\newcommand{\SubProduct}[3]{
    % Arguments : Description, quantity, Excl-VAT Unit Price
    \FPround{\prix}{#3}{2}
    \FPeval{\amount}{#2 * #3}
    \FPround{\amount}{\amount}{2}
    \FPsub{\TotalExclVAT}{\TotalExclVAT}{\amount}

    \eaddto\ProductsList{#1    &    -\prix    &    #2    &    -\amount    \cr}
}


\newcommand{\AfficheResultat}{
    \ProductsList

    \FPeval{\TotalVAT}{\TotalExclVAT * \VAT / 100}
    \FPadd{\TotalTTC}{\TotalExclVAT}{\TotalVAT}
    \FPround{\TotalExclVAT}{\TotalExclVAT}{2}
    \FPround{\TotalVAT}{\TotalVAT}{2}
    \FPround{\TotalTTC}{\TotalTTC}{2}
    \global\let\TotalExclVAT\TotalExclVAT
    \global\let\TotalVAT\TotalVAT
    \global\let\TotalTTC\TotalTTC

    \cr \hline
    %Total Excl VAT            & & &    \TotalExclVAT \cr
    %VAT \VAT~\%               & & &    \TotalVAT     \cr
    %\hline \hline
    \textbf{Total Excl VAT}    & & &    \TotalExclVAT \cr
    \textbf{Total VAT}         & & &    \TotalVAT     \cr
}

\newcommand*\eaddto[2] {% improved version of \addto
   \edef\tmp{#2}%
   \expandafter\addto
   \expandafter#1%
   \expandafter{\tmp}%
}
""",

    FOOTER = r"""
\geometry{{verbose,tmargin=4em,bmargin=8em,lmargin=6em,rmargin=6em}}
\setlength{{\parindent}}{{0pt}}
\setlength{{\parskip}}{{1ex plus 0.5ex minus 0.2ex}}

\thispagestyle{{fancy}}
\pagestyle{{fancy}}
\setlength{{\parindent}}{{0pt}}

\renewcommand{{\headrulewidth}}{{0pt}}
\cfoot{{
    \small{{
{name}\\
Telephone : {telephone} ~--~ Web site : {website} ~--~ E-mail : {email}\\
Company number {firm_number} ~--~ SIC {SIC}}}\\
}}

\begin{{document}}

% Logo of the firm…
% logo

% Name and address of the firm
{name} \newline
{address}

\ifthenelse{{\equal{{\InvoiceKind}}{{quote}}}}{{
    Quote #\InvoiceId
}}{{
    Invoice #\InvoiceId
}}

{{\addtolength{{\leftskip}}{{10.5cm}} %in ERT
    \textbf{{\ClientName}}    \\
    \ClientAddr        \\

}} %in ERT

\hspace*{{12cm}}
\InvoicePlace, on \today

~\\~\\

\textbf{{Subject : \InvoiceSubject \\}}

\textnormal{{\InvoiceDescr}}

%~\\
\vspace{{30mm}}

\begin{{center}}
    \begin{{tabular}}{{lrrr}}
        \textbf{{Product name ~~~~~}}    & \textbf{{Unit price   }}    & \textbf{{Quantity}}    & \textbf{{Amount (EUR) }}    \\
        \hline
        \AfficheResultat{{}}
    \end{{tabular}}
\end{{center}}

%~\\
\vspace{{50mm}}

\ifthenelse{{\equal{{\InvoiceKind}}{{paid}}}}{{
    Invoice paid.
}}{{
    Invoice to be paid, by check or wire transfer over:

    \begin{{center}}
        \begin{{tabular}}{{|c c|}}
            \hline     \textbf{{Sort code}}    & \textbf{{Account number}}    \\
                    {sort_code}                & {account_number}             \\
            \hline     \textbf{{IBAN Nº}}        &  {iban}                    \\
            \hline     \textbf{{Code BIC}}       &  {bics}                    \\
            \hline
        \end{{tabular}}
    \end{{center}}

}}

\end{{document}}
"""
))
