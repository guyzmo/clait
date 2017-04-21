#!/usr/bin/env python

from ..formatter import register_template

'''
source:
    name:
    address:
    telephone:
    website:
    email:
    siren:
    ape:
    bank_rib:
    bank_iban:
    bank_bics:
'''

register_template('french_autoentrepreneur', dict(
    INVOICE = """
{HEADER}

\def\FactureNum         {{{iid}}}
\def\FactureAcquittee   {{{kind}}}
\def\FactureLieu        {{{place}}}
\def\FactureObjet       {{{subject}}}
\def\FactureDescr {{
{desc}
}}

{customer}

{products}

{FOOTER}
""",

    PRODUCT = """\
\AjouterProduit {{{descr}}}        {{{qty}}}        {{{price}}}
""",

    OFFER = """\
\SoustraireProduit {{{descr}}}        {{{qty}}}        {{{price}}}
""",

    CUSTOMER = """\
\def\ClientNom{{{name}}}
\def\ClientAdresse{{{address}}}
""",

    HEADER = r"""
\documentclass[french,11pt]{article}
\usepackage{babel}
\usepackage[utf8]{inputenc}
\usepackage[a4paper]{geometry}
\usepackage{units}
\usepackage{graphicx}
\usepackage{fancyhdr}
\usepackage{fp}

\def\TVA{0}    % Taux de la TVA

\def\TotalHT{0}
\def\TotalTVA{0}

\newcommand{\AjouterProduit}[3]{%    Arguments : Désignation, quantité, prix unitaire HT
    \FPround{\prix}{#3}{2}
    \FPeval{\montant}{#2 * #3}
    \FPround{\montant}{\montant}{2}
    \FPadd{\TotalHT}{\TotalHT}{\montant}

    \eaddto\ListeProduits{#1    &    \prix    &    #2    &    \montant    \cr}
}

\newcommand{\SoustraireProduit}[3]{%    Arguments : Désignation, quantité, prix unitaire HT
    \FPround{\prix}{#3}{2}
    \FPeval{\montant}{#2 * #3}
    \FPround{\montant}{\montant}{2}
    \FPsub{\TotalHT}{\TotalHT}{\montant}

    \eaddto\ListeProduits{#1    &    -\prix    &    #2    &    -\montant    \cr}
}


\newcommand{\AfficheResultat}{
    \ListeProduits

    \FPeval{\TotalTVA}{\TotalHT * \TVA / 100}
    \FPadd{\TotalTTC}{\TotalHT}{\TotalTVA}
    \FPround{\TotalHT}{\TotalHT}{2}
    \FPround{\TotalTVA}{\TotalTVA}{2}
    \FPround{\TotalTTC}{\TotalTTC}{2}
    \global\let\TotalHT\TotalHT
    \global\let\TotalTVA\TotalTVA
    \global\let\TotalTTC\TotalTTC

    \cr \hline
    %Total HT            & & &    \TotalHT    \cr
    %TVA \TVA~\%         & & &    \TotalTVA    \cr
    %\hline \hline
    \textbf{Total HT}    & & &    \TotalHT \cr
    {\small TVA non applicable, art 293 B du CGI}
}

\newcommand*\eaddto[2] {% version développée de \addto
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
Telephone : {telephone} ~--~ Site web : {website} ~--~ E-mail : {email}\\
SIREN {siren} ~--~ Code APE {ape}}}\\
    \tiny{{
Dispensé d'immatriculation au registre du commerce et des sociétés et au répertoire des métiers
    }}
}}

\begin{{document}}

% Logo de la société
% logo

% Nom et adresse de la société
{name} \newline
{address}

\ifthenelse{{\equal{{\FactureAcquittee}}{{quote}}}}{{
    Devis nº\FactureNum
}}{{
    Facture nº\FactureNum
}}

{{\addtolength{{\leftskip}}{{10.5cm}} %in ERT
    \textbf{{\ClientNom}}    \\
    \ClientAdresse        \\

}} %in ERT

\hspace*{{12cm}}
\FactureLieu, le \today

~\\~\\

\textbf{{Objet : \FactureObjet \\}}

\textnormal{{\FactureDescr}}

%~\\
\vspace{{\fill}}

\begin{{center}}
    \begin{{tabular}}{{lrrr}}
        \textbf{{Désignation ~~~~~~}}    & \textbf{{Prix unitaire}}    & \textbf{{Quantité}}    & \textbf{{Montant (EUR)}}    \\
        \hline
        \AfficheResultat{{}}
    \end{{tabular}}
\end{{center}}

%~\\
\vspace{{\fill}}

\ifthenelse{{\equal{{\FactureAcquittee}}{{paid}}}}{{
    Facture acquittée.
}}{{
    Paiement à 60 jours suivant réception de la facture par chèque ou virement
    bancaire aux coordonnées suivantes :

    \begin{{center}}
        \begin{{tabular}}{{|c c c c|}}
            \hline     \textbf{{Code banque}}    & \textbf{{Code guichet}}    & \textbf{{Nº de Compte}}        & \textbf{{Clé RIB}}    \\
                    {bank_rib}                \\
            \hline     \textbf{{IBAN Nº}}        & \multicolumn{{3}}{{|l|}}{{ {bank_iban} }}         \\
            \hline     \textbf{{Code BIC}}       & \multicolumn{{3}}{{|l|}}{{ {bank_bics} }}         \\
            \hline
        \end{{tabular}}
    \end{{center}}
    En cas de retard de paiement, une indemnité forfaitaire de compensation des
    frais de recouvrement sera due en application des articles L. 441-6 et D.
    441-5 du Code de Commerce.

    Taux des pénalités en l’absence de paiement : 25\%
}}

\end{{document}}
"""
))
