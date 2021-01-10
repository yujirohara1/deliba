from flask import Flask, make_response, send_file
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.lib.pagesizes import A4, portrait
from reportlab.platypus import Table, TableStyle
from reportlab.lib.units import mm
from reportlab.lib import colors

def make(filename="resume"): # ファイル名の設定
    pdf_canvas = set_info(filename) # キャンバス名の設定
    print_string(pdf_canvas)
    pdf_canvas.save() # pdfを保存

def set_info(filename):
    pdf_canvas = canvas.Canvas("./output/{0}.pdf".format(filename)) # 保存先の設定
    # ファイル情報の登録（任意）
    pdf_canvas.setAuthor("") # 作者
    pdf_canvas.setTitle("") # 表題
    pdf_canvas.setSubject("") # 件名
    return pdf_canvas

def print_string(pdf_canvas):

    # フォント登録
    pdfmetrics.registerFont(UnicodeCIDFont('HeiseiKakuGo-W5'))

    # 用紙サイズ定義（この場合はA4）
    width, height = A4
    #pagesize=landscape(A4)

    # フォントサイズ定義（この場合は24）
    font_size = 24

    pdf_canvas.setFont('HeiseiKakuGo-W5', font_size)

    # 書き出す(横位置, 縦位置, 文字)を指定
    pdf_canvas.drawString(60, 770, 'aaaa履 aaaaa 歴ba書') 
    

