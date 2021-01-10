from flask import Flask, make_response, send_file
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.pagesizes import A4, portrait, landscape
from reportlab.platypus import Table, TableStyle
from reportlab.lib.units import mm
from reportlab.lib import colors
import datetime
import locale

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
    #locale.setlocale(locale.LC_TIME, 'ja_JP.UTF-8')

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
    
    print_string_ue(pdf_canvas, 45, 45)
    print_string_ue(pdf_canvas, 45, 345)
    
    ## def_font_size = 9
    ## def_font_type = 'HeiseiKakuGo-W5'
    ## 
    ## pdf_canvas.setFillColorRGB(float(1)/255,float(1)/255,float(1)/255) 
    ## 
    ## font_size = def_font_size
    ## pdf_canvas.setFont(def_font_type, font_size)
    ## pdf_canvas.drawString(start_x,         start_y, '24L')     # 左　顧客ID
    ## pdf_canvas.drawString(start_x+178,     start_y, '24C') # 中　顧客ID
    ## pdf_canvas.drawString(start_x+333,     start_y, '24R') # 右　顧客ID
    ## 
    ## font_size = def_font_size+1
    ## pdf_canvas.setFont(def_font_type, font_size)
    ## pdf_canvas.drawString(start_x,         start_y+44, '片岡美容室L') 
    ## pdf_canvas.drawString(start_x+178,     start_y+44, '片岡美容室C') 
    ## font_size = def_font_size+5
    ## pdf_canvas.setFont(def_font_type, font_size)
    ## pdf_canvas.drawString(start_x+178+155, start_y+19, '片岡美容室R') 
    ## 
    ## font_size = def_font_size+1
    ## pdf_canvas.setFont(def_font_type, font_size)
    ## pdf_canvas.drawString(start_x+37,      start_y+76, '令和L') 
    ## pdf_canvas.drawString(start_x+101,     start_y+76, '1L') 
    ## pdf_canvas.drawString(start_x+37+158,  start_y+76, '令和C') 
    ## pdf_canvas.drawString(start_x+101+158, start_y+76, '1C') 
    ## pdf_canvas.drawString(start_x+510,     start_y+21, '令和R') 
    ## pdf_canvas.drawString(start_x+510+64,  start_y+21, '1R') 
    ## 
    ## font_size = def_font_size-1
    ## pdf_canvas.setFont(def_font_type, font_size)
    ## pdf_canvas.drawString(start_x+37,      start_y+106, '（本体2,360 + 税18L）') 
    ## pdf_canvas.drawString(start_x+198,     start_y+106, '（本体2,360 + 税18C）') 
    ## pdf_canvas.drawString(start_x+690,     start_y+2,   '（本体2,360 + 税18R）') 
    ## 
    ## font_size = def_font_size+1
    ## pdf_canvas.setFont(def_font_type, font_size)
    ## pdf_canvas.drawString(start_x+37+30,   start_y+106+14, '￥ 2,548') 
    ## pdf_canvas.drawString(start_x+198+30,  start_y+106+14, '￥ 2,548') 
    ## font_size = def_font_size+3
    ## pdf_canvas.setFont(def_font_type, font_size)
    ## pdf_canvas.drawString(start_x+720,     start_y+20,     '￥ 2,548') 
    ## 
    ## font_size = def_font_size-2
    ## pdf_canvas.setFont(def_font_type, font_size)
    ## pdf_canvas.drawString(start_x+3,       start_y+170,    'Tセンド721') 
    ## pdf_canvas.drawString(start_x+3,       start_y+170+13, 'Tセンド722') 
    ## pdf_canvas.drawString(start_x+3,       start_y+170+26, 'Tセンド723') 
    ## pdf_canvas.drawString(start_x+3,       start_y+170+39, 'Tセンド724') 
    ## pdf_canvas.drawString(start_x+3,       start_y+170+52, 'Tセンド725') 
    ## pdf_canvas.drawString(start_x+3,       start_y+170+65, 'Tセンド726') 
    ## 
    ## pdf_canvas.drawString(start_x+3+80,    start_y+170,    '8') 
    ## pdf_canvas.drawString(start_x+3+80,    start_y+170+13, '8') 
    ## pdf_canvas.drawString(start_x+3+80,    start_y+170+26, '8') 
    ## pdf_canvas.drawString(start_x+3+80,    start_y+170+39, '8') 
    ## pdf_canvas.drawString(start_x+3+80,    start_y+170+52, '8') 
    ## pdf_canvas.drawString(start_x+3+80,    start_y+170+65, '8') 
    ## 
    ## pdf_canvas.drawString(start_x+3+95,    start_y+170,    '295') 
    ## pdf_canvas.drawString(start_x+3+95,    start_y+170+13, '295') 
    ## pdf_canvas.drawString(start_x+3+95,    start_y+170+26, '295') 
    ## pdf_canvas.drawString(start_x+3+95,    start_y+170+39, '295') 
    ## pdf_canvas.drawString(start_x+3+95,    start_y+170+52, '295') 
    ## pdf_canvas.drawString(start_x+3+95,    start_y+170+65, '295') 
    ## 
    ## pdf_canvas.drawString(start_x+3+125,    start_y+170,    '　110') 
    ## pdf_canvas.drawString(start_x+3+125,    start_y+170+13, '　220') 
    ## pdf_canvas.drawString(start_x+3+125,    start_y+170+26, '2,360') 
    ## pdf_canvas.drawString(start_x+3+125,    start_y+170+39, '2,770') 
    ## pdf_canvas.drawString(start_x+3+125,    start_y+170+52, '2,990') 
    ## pdf_canvas.drawString(start_x+3+125,    start_y+170+65, '2,360') 
    ## 
    ## font_size = def_font_size-1
    ## pdf_canvas.setFont(def_font_type, font_size)
    ## pdf_canvas.drawString(start_x+178+155+2, start_y+68, 'Tセンド72R') 
    ## pdf_canvas.drawString(start_x+178+155+2, start_y+68+13, 'Tセンド72R') 
    ## pdf_canvas.drawString(start_x+178+155+2, start_y+68+26, 'Tセンド72R') 
    ## pdf_canvas.drawString(start_x+178+155+2, start_y+68+39, 'Tセンド72R') 
    ## pdf_canvas.drawString(start_x+178+155+2, start_y+68+52, 'Tセンド72R') 
    ## pdf_canvas.drawString(start_x+178+155+2, start_y+68+65, 'Tセンド72R') 
    ## 
    ## pdf_canvas.drawString(start_x+178+155+103, start_y+68,    '10') 
    ## pdf_canvas.drawString(start_x+178+155+103, start_y+68+13, '10') 
    ## pdf_canvas.drawString(start_x+178+155+103, start_y+68+26, '10') 
    ## pdf_canvas.drawString(start_x+178+155+103, start_y+68+39, '10') 
    ## pdf_canvas.drawString(start_x+178+155+103, start_y+68+52, '10') 
    ## pdf_canvas.drawString(start_x+178+155+103, start_y+68+65, '10') 
    ## 
    ## pdf_canvas.drawString(start_x+178+155+123, start_y+68,    '295') 
    ## pdf_canvas.drawString(start_x+178+155+123, start_y+68+13, '295') 
    ## pdf_canvas.drawString(start_x+178+155+123, start_y+68+26, '295') 
    ## pdf_canvas.drawString(start_x+178+155+123, start_y+68+39, '295') 
    ## pdf_canvas.drawString(start_x+178+155+123, start_y+68+52, '295') 
    ## pdf_canvas.drawString(start_x+178+155+123, start_y+68+65, '295') 
    ## 
    ## pdf_canvas.drawString(start_x+178+155+173, start_y+68,    '　110') 
    ## pdf_canvas.drawString(start_x+178+155+173, start_y+68+13, '　220') 
    ## pdf_canvas.drawString(start_x+178+155+173, start_y+68+26, '2,360') 
    ## pdf_canvas.drawString(start_x+178+155+173, start_y+68+39, '2,770') 
    ## pdf_canvas.drawString(start_x+178+155+173, start_y+68+52, '2,990') 
    ## pdf_canvas.drawString(start_x+178+155+173, start_y+68+65, '2,360') 
    ## 
    ## # カレンダー 1日～15日 見出し
    ## font_size = def_font_size-1
    ## pdf_canvas.setFont(def_font_type, font_size)
    ## pdf_canvas.setFillColorRGB(float(1)/255,float(1)/255,float(255)/255) 
    ## for i in range(15):
    ##   pdf_canvas.drawString(start_x+517+((i+1)*16.8),         start_y+44, str(i+1)) 
    ##   
    ## # カレンダー 1日～15日 曜日
    ## font_size = def_font_size
    ## pdf_canvas.setFont(def_font_type, font_size)
    ## pdf_canvas.setFillColorRGB(float(1)/255,float(1)/255,float(255)/255) 
    ## for i in range(15):
    ##   dt = datetime.datetime(2020, 12, i+1)
    ##   pdf_canvas.drawString(start_x+517+((i+1)*16.8),         start_y+57, get_day_of_week_jp(dt)) 
    ## 
    ## # カレンダー 1日～15日 本数
    ## font_size = def_font_size-1
    ## pdf_canvas.setFont(def_font_type, font_size)
    ## pdf_canvas.setFillColorRGB(float(1)/255,float(1)/255,float(1)/255) 
    ## for i in range(6):
    ##   for d in range(15):
    ##     dt = datetime.datetime(2020, 12, d+1)
    ##     pdf_canvas.drawString(start_x+517+((d+1)*16.8),         (start_y+68)+(i*13), '1') 
    ## 
    ## 
    ## # カレンダー 16日～31日 見出し
    ## font_size = def_font_size-1
    ## pdf_canvas.setFont(def_font_type, font_size)
    ## pdf_canvas.setFillColorRGB(float(1)/255,float(1)/255,float(255)/255) 
    ## for i in range(16):
    ##   pdf_canvas.drawString(start_x+500+((i+1)*16.9),         start_y+146, str(i+16)) 
    ##   
    ## font_size = def_font_size
    ## pdf_canvas.setFont(def_font_type, font_size)
    ## pdf_canvas.setFillColorRGB(float(1)/255,float(1)/255,float(255)/255) 
    ## for i in range(16):
    ##   dt = datetime.datetime(2020, 12, i+16)
    ##   pdf_canvas.drawString(start_x+500+((i+1)*16.9),         start_y+159, get_day_of_week_jp(dt)) 
    ## 
    ## 
    ## # カレンダー 16日～31日 本数
    ## font_size = def_font_size-1
    ## pdf_canvas.setFont(def_font_type, font_size)
    ## pdf_canvas.setFillColorRGB(float(1)/255,float(1)/255,float(1)/255) 
    ## for i in range(6):
    ##   for d in range(16):
    ##     dt = datetime.datetime(2020, 12, d+16)
    ##     pdf_canvas.drawString(start_x+500+((d+1)*16.9),         (start_y+172)+(i*13), '2') 
    ## 
    ## font_size = def_font_size+5
    ## pdf_canvas.setFont(def_font_type, font_size)
    ## pdf_canvas.drawString(start_x+178+155+10, start_y+161, '御請求額　￥2,548') 
    ## 
    ## font_size = def_font_size+0.5
    ## pdf_canvas.setFont(def_font_type, font_size)
    ## pdf_canvas.drawString(start_x+178+155+6, start_y+179, 'ご希望の方には、口座引落しを') 
    ## pdf_canvas.drawString(start_x+178+155+6, start_y+190, 'ご案内しております。ご相談ください。') 
    ## 
    ## #比較用のライン
    ## pdf_canvas.setLineWidth(0.5)
    ## pdf_canvas.line(384, 210, 530, 210)
    ## pdf_canvas.line(50, 100, 200, 100)

def get_day_of_week_jp(dt):
    w_list = ['月', '火', '水', '木', '金', '土', '日']
    return(w_list[dt.weekday()])



def print_string_ue(pdf_canvas,start_x,start_y):

    # フォントを登録
    pdfmetrics.registerFont(UnicodeCIDFont('HeiseiKakuGo-W5'))

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
    pdf_canvas.drawString(start_x+510,     start_y+21, '令和R') 
    pdf_canvas.drawString(start_x+510+64,  start_y+21, '1R') 
    
    font_size = def_font_size-1
    pdf_canvas.setFont(def_font_type, font_size)
    pdf_canvas.drawString(start_x+37,      start_y+106, '（本体2,360 + 税18L）') 
    pdf_canvas.drawString(start_x+198,     start_y+106, '（本体2,360 + 税18C）') 
    pdf_canvas.drawString(start_x+690,     start_y+2,   '（本体2,360 + 税18R）') 
    
    font_size = def_font_size+1
    pdf_canvas.setFont(def_font_type, font_size)
    pdf_canvas.drawString(start_x+37+30,   start_y+106+14, '￥ 2,548') 
    pdf_canvas.drawString(start_x+198+30,  start_y+106+14, '￥ 2,548') 
    font_size = def_font_size+3
    pdf_canvas.setFont(def_font_type, font_size)
    pdf_canvas.drawString(start_x+720,     start_y+20,     '￥ 2,548') 
    
    font_size = def_font_size-2
    pdf_canvas.setFont(def_font_type, font_size)
    pdf_canvas.drawString(start_x+3,       start_y+170,    'Tセンド721') 
    pdf_canvas.drawString(start_x+3,       start_y+170+13, 'Tセンド722') 
    pdf_canvas.drawString(start_x+3,       start_y+170+26, 'Tセンド723') 
    pdf_canvas.drawString(start_x+3,       start_y+170+39, 'Tセンド724') 
    pdf_canvas.drawString(start_x+3,       start_y+170+52, 'Tセンド725') 
    pdf_canvas.drawString(start_x+3,       start_y+170+65, 'Tセンド726') 
    
    pdf_canvas.drawString(start_x+3+80,    start_y+170,    '8') 
    pdf_canvas.drawString(start_x+3+80,    start_y+170+13, '8') 
    pdf_canvas.drawString(start_x+3+80,    start_y+170+26, '8') 
    pdf_canvas.drawString(start_x+3+80,    start_y+170+39, '8') 
    pdf_canvas.drawString(start_x+3+80,    start_y+170+52, '8') 
    pdf_canvas.drawString(start_x+3+80,    start_y+170+65, '8') 
    
    pdf_canvas.drawString(start_x+3+95,    start_y+170,    '295') 
    pdf_canvas.drawString(start_x+3+95,    start_y+170+13, '295') 
    pdf_canvas.drawString(start_x+3+95,    start_y+170+26, '295') 
    pdf_canvas.drawString(start_x+3+95,    start_y+170+39, '295') 
    pdf_canvas.drawString(start_x+3+95,    start_y+170+52, '295') 
    pdf_canvas.drawString(start_x+3+95,    start_y+170+65, '295') 
    
    pdf_canvas.drawString(start_x+3+125,    start_y+170,    '　110') 
    pdf_canvas.drawString(start_x+3+125,    start_y+170+13, '　220') 
    pdf_canvas.drawString(start_x+3+125,    start_y+170+26, '2,360') 
    pdf_canvas.drawString(start_x+3+125,    start_y+170+39, '2,770') 
    pdf_canvas.drawString(start_x+3+125,    start_y+170+52, '2,990') 
    pdf_canvas.drawString(start_x+3+125,    start_y+170+65, '2,360') 
    
    font_size = def_font_size-1
    pdf_canvas.setFont(def_font_type, font_size)
    pdf_canvas.drawString(start_x+178+155+2, start_y+68, 'Tセンド72R') 
    pdf_canvas.drawString(start_x+178+155+2, start_y+68+13, 'Tセンド72R') 
    pdf_canvas.drawString(start_x+178+155+2, start_y+68+26, 'Tセンド72R') 
    pdf_canvas.drawString(start_x+178+155+2, start_y+68+39, 'Tセンド72R') 
    pdf_canvas.drawString(start_x+178+155+2, start_y+68+52, 'Tセンド72R') 
    pdf_canvas.drawString(start_x+178+155+2, start_y+68+65, 'Tセンド72R') 
    
    pdf_canvas.drawString(start_x+178+155+103, start_y+68,    '10') 
    pdf_canvas.drawString(start_x+178+155+103, start_y+68+13, '10') 
    pdf_canvas.drawString(start_x+178+155+103, start_y+68+26, '10') 
    pdf_canvas.drawString(start_x+178+155+103, start_y+68+39, '10') 
    pdf_canvas.drawString(start_x+178+155+103, start_y+68+52, '10') 
    pdf_canvas.drawString(start_x+178+155+103, start_y+68+65, '10') 
    
    pdf_canvas.drawString(start_x+178+155+123, start_y+68,    '295') 
    pdf_canvas.drawString(start_x+178+155+123, start_y+68+13, '295') 
    pdf_canvas.drawString(start_x+178+155+123, start_y+68+26, '295') 
    pdf_canvas.drawString(start_x+178+155+123, start_y+68+39, '295') 
    pdf_canvas.drawString(start_x+178+155+123, start_y+68+52, '295') 
    pdf_canvas.drawString(start_x+178+155+123, start_y+68+65, '295') 
    
    pdf_canvas.drawString(start_x+178+155+170, start_y+68,    '　110') 
    pdf_canvas.drawString(start_x+178+155+170, start_y+68+13, '　220') 
    pdf_canvas.drawString(start_x+178+155+170, start_y+68+26, '2,360') 
    pdf_canvas.drawString(start_x+178+155+170, start_y+68+39, '2,770') 
    pdf_canvas.drawString(start_x+178+155+170, start_y+68+52, '2,990') 
    pdf_canvas.drawString(start_x+178+155+170, start_y+68+65, '2,360') 
    
    # カレンダー 1日～15日 見出し
    font_size = def_font_size-1
    pdf_canvas.setFont(def_font_type, font_size)
    pdf_canvas.setFillColorRGB(float(1)/255,float(1)/255,float(255)/255) 
    for i in range(15):
      pdf_canvas.drawString(start_x+517+((i+1)*16.8),         start_y+44, str(i+1)) 
      
    # カレンダー 1日～15日 曜日
    font_size = def_font_size
    pdf_canvas.setFont(def_font_type, font_size)
    pdf_canvas.setFillColorRGB(float(1)/255,float(1)/255,float(255)/255) 
    for i in range(15):
      dt = datetime.datetime(2020, 12, i+1)
      pdf_canvas.drawString(start_x+517+((i+1)*16.8),         start_y+57, get_day_of_week_jp(dt)) 
    
    # カレンダー 1日～15日 本数
    font_size = def_font_size-1
    pdf_canvas.setFont(def_font_type, font_size)
    pdf_canvas.setFillColorRGB(float(1)/255,float(1)/255,float(1)/255) 
    for i in range(6):
      for d in range(15):
        dt = datetime.datetime(2020, 12, d+1)
        pdf_canvas.drawString(start_x+517+((d+1)*16.8),         (start_y+68)+(i*13), '1') 
    
    
    # カレンダー 16日～31日 見出し
    font_size = def_font_size-1
    pdf_canvas.setFont(def_font_type, font_size)
    pdf_canvas.setFillColorRGB(float(1)/255,float(1)/255,float(255)/255) 
    for i in range(16):
      pdf_canvas.drawString(start_x+500+((i+1)*16.9),         start_y+146, str(i+16)) 
      
    font_size = def_font_size
    pdf_canvas.setFont(def_font_type, font_size)
    pdf_canvas.setFillColorRGB(float(1)/255,float(1)/255,float(255)/255) 
    for i in range(16):
      dt = datetime.datetime(2020, 12, i+16)
      pdf_canvas.drawString(start_x+500+((i+1)*16.9),         start_y+159, get_day_of_week_jp(dt)) 
    
    
    # カレンダー 16日～31日 本数
    font_size = def_font_size-1
    pdf_canvas.setFont(def_font_type, font_size)
    pdf_canvas.setFillColorRGB(float(1)/255,float(1)/255,float(1)/255) 
    for i in range(6):
      for d in range(16):
        dt = datetime.datetime(2020, 12, d+16)
        pdf_canvas.drawString(start_x+500+((d+1)*16.9),         (start_y+172)+(i*13), '2') 
    
    font_size = def_font_size+5
    pdf_canvas.setFont(def_font_type, font_size)
    pdf_canvas.drawString(start_x+178+155+10, start_y+161, '御請求額　￥2,548') 
    
    font_size = def_font_size+0.5
    pdf_canvas.setFont(def_font_type, font_size)
    pdf_canvas.drawString(start_x+178+155+6, start_y+179, 'ご希望の方には、口座引落しを') 
    pdf_canvas.drawString(start_x+178+155+6, start_y+190, 'ご案内しております。ご相談ください。') 
    
    #比較用のライン
    pdf_canvas.setLineWidth(0.5)
    pdf_canvas.line(start_x+339, start_y+165, start_x+485, start_y+165)
