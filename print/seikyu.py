from flask import Flask, make_response, send_file
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.pagesizes import A4, portrait, landscape
from reportlab.platypus import Table, TableStyle
from reportlab.lib.units import mm
from reportlab.lib import colors

def make(filename="resume"): # ファイル名の設定
    pdf_canvas = set_info(filename) # キャンバス名の設定
    print_string(pdf_canvas)
    pdf_canvas.save() # pdfを保存

def set_info(filename): 
    pdf_canvas = canvas.Canvas("./output/{0}.pdf".format(filename), pagesize=landscape(A4), bottomup=False) # 保存先の設定 bottomup=Falseで座標の始点を左上へ変更
    # ファイル情報の登録（任意）
    pdf_canvas.setAuthor("") # 作者
    pdf_canvas.setTitle("") # 表題
    pdf_canvas.setSubject("") # 件名
    return pdf_canvas

def print_string(pdf_canvas):

    # フォント登録
    # pdfmetrics.registerFont(TTFont('GenShinGothic','./fonts/GenShinGothic-Monospace-Medium.ttf'))
    pdfmetrics.registerFont(UnicodeCIDFont('HeiseiKakuGo-W5'))
    # pdfmetrics.registerFont(UnicodeCIDFont('HeiseiMin-W3'))
    # フォントを登録
    

    # 用紙サイズ定義（この場合はA4）
    #width, height = landscape(A4)
    #pagesize=landscape(A4)

    # フォントサイズ定義（この場合は24）
    #font_size = 24
    #pdf_canvas.setFont('GenShinGothic', font_size)
    #pdf_canvas.drawString(0, 10, 'aaaa履 aaaaa 歴ba書') # 書き出す(横位置, 縦位置, 文字)を指定
    
    start_x = 45
    start_y = 45
    def_font_size = 9
    def_font_type = 'HeiseiKakuGo-W5'
    
    pdf_canvas.setFillColorRGB(float(1)/255,float(1)/255,float(1)/255) 
       
    font_size = def_font_size
    pdf_canvas.setFont(def_font_type, font_size)
    pdf_canvas.drawString(start_x,         start_y, '24L')     # 左　顧客ID
    pdf_canvas.drawString(start_x+178,     start_y, '24C') # 中　顧客ID
    pdf_canvas.drawString(start_x+333,     start_y, '24R') # 右　顧客ID
    
    font_size = def_font_size+1
    pdf_canvas.setFont(def_font_type, font_size)
    pdf_canvas.drawString(start_x,         start_y+44, '片岡美容室L') 
    pdf_canvas.drawString(start_x+178,     start_y+44, '片岡美容室C') 
    font_size = def_font_size+5
    pdf_canvas.setFont(def_font_type, font_size)
    pdf_canvas.drawString(start_x+178+155, start_y+19, '片岡美容室R') 
    
    font_size = def_font_size+1
    pdf_canvas.setFont(def_font_type, font_size)
    pdf_canvas.drawString(start_x+37,      start_y+76, '令和L') 
    pdf_canvas.drawString(start_x+101,     start_y+76, '1L') 
    pdf_canvas.drawString(start_x+37+158,  start_y+76, '令和C') 
    pdf_canvas.drawString(start_x+101+158, start_y+76, '1C') 
    
    font_size = def_font_size-1
    pdf_canvas.setFont(def_font_type, font_size)
    pdf_canvas.drawString(start_x+37,      start_y+106, '（本体2,360 + 税18L）') 
    pdf_canvas.drawString(start_x+198,     start_y+106, '（本体2,360 + 税18C）') 
    
    font_size = def_font_size+1
    pdf_canvas.setFont(def_font_type, font_size)
    pdf_canvas.drawString(start_x+37+30,   start_y+106+14, '￥ 2,548') 
    pdf_canvas.drawString(start_x+198+30,  start_y+106+14, '￥ 2,548') 
    
    font_size = def_font_size-2
    pdf_canvas.setFont(def_font_type, font_size)
    pdf_canvas.drawString(start_x+3,       start_y+170,    'Tセンド721') 
    pdf_canvas.drawString(start_x+3,       start_y+170+12, 'Tセンド722') 
    pdf_canvas.drawString(start_x+3,       start_y+170+24, 'Tセンド723') 
    pdf_canvas.drawString(start_x+3,       start_y+170+36, 'Tセンド724') 
    pdf_canvas.drawString(start_x+3,       start_y+170+48, 'Tセンド725') 
    pdf_canvas.drawString(start_x+3,       start_y+170+60, 'Tセンド726') 
    
    pdf_canvas.drawString(start_x+3+80,    start_y+170,    '8') 
    pdf_canvas.drawString(start_x+3+80,    start_y+170+12, '8') 
    pdf_canvas.drawString(start_x+3+80,    start_y+170+24, '8') 
    pdf_canvas.drawString(start_x+3+80,    start_y+170+36, '8') 
    pdf_canvas.drawString(start_x+3+80,    start_y+170+48, '8') 
    pdf_canvas.drawString(start_x+3+80,    start_y+170+60, '8') 
    
    pdf_canvas.drawString(start_x+3+95,    start_y+170,    '295') 
    pdf_canvas.drawString(start_x+3+95,    start_y+170+12, '295') 
    pdf_canvas.drawString(start_x+3+95,    start_y+170+24, '295') 
    pdf_canvas.drawString(start_x+3+95,    start_y+170+36, '295') 
    pdf_canvas.drawString(start_x+3+95,    start_y+170+48, '295') 
    pdf_canvas.drawString(start_x+3+95,    start_y+170+60, '295') 
    
    pdf_canvas.drawString(start_x+3+125,    start_y+170,    '2,360') 
    pdf_canvas.drawString(start_x+3+125,    start_y+170+12, '2,360') 
    pdf_canvas.drawString(start_x+3+125,    start_y+170+24, '2,360') 
    pdf_canvas.drawString(start_x+3+125,    start_y+170+36, '2,360') 
    pdf_canvas.drawString(start_x+3+125,    start_y+170+48, '2,360') 
    pdf_canvas.drawString(start_x+3+125,    start_y+170+60, '2,360') 
    
    #font_size = 18
    #pdf_canvas.setFont('GenShinGothic', font_size)
    #pdf_canvas.drawString(50, 50, '248テスabcト　こんにちは11111') 
    

