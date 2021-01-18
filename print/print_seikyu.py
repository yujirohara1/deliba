from flask import Flask, make_response, send_file
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.pagesizes import A4, portrait, landscape
from reportlab.platypus import Table, TableStyle, PageBreak
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.rl_config import defaultPageSize
import datetime
import locale
from api.database import db, ma
from sqlalchemy.sql import text

font_type = 'HeiseiKakuGo-W5'


def make(filename="resume"): # ファイル名の設定



  sql = ""
  sql = sql + "  SELECT to_char(seikyu.deliver_ymd,'yyyy')        nen,                                                                                  " 
  sql = sql + "         to_char(seikyu.deliver_ymd,'mm')         tuki,                                                                                   " 
  sql = sql + "         seikyu.customer_id,                                                                                                             " 
  sql = sql + "         seikyu.deliver_ymd,                                                                                                             " 
  sql = sql + "         seikyu.item_id,                                                                                                                 " 
  sql = sql + "         seikyu.price,                                                                                                                   " 
  sql = sql + "         seikyu.quantity,                                                                                                                " 
  sql = sql + "         item.code                               item_code,                                                                              " 
  sql = sql + "         item.name1                              item_name1,                                                                             " 
  sql = sql + "         item.name2                              item_name2,                                                                             " 
  sql = sql + "         customer.name1                          customer_name1,                                                                         " 
  sql = sql + "         customer.name2                          customer_name2,                                                                         " 
  sql = sql + "         customer.list,                                                                                                                  " 
  sql = sql + "         customer.group_id,                                                                                                              " 
  sql = sql + "         to_char(seikyu.deliver_ymd,'yyyy') || to_char(seikyu.deliver_ymd,'mm') || lpad(seikyu.customer_id::text,6,0::text) SEIKYU_KEY,  " 
  sql = sql + "         customer.harai_kb ,                                                                                                             " 
  sql = sql + "         customer.biko2 zei_kb                                                                                                           " 
  sql = sql + "  FROM   seikyu                                                                                                                          " 
  sql = sql + "  inner join item                                                                                                                        " 
  sql = sql + "  on                                                                                                                                     " 
  sql = sql + "      seikyu.item_id = item.id                                                                                                           " 
  sql = sql + "  inner join customer                                                                                                                    " 
  sql = sql + "  on                                                                                                                                     " 
  sql = sql + "      seikyu.customer_id = customer.id                                                                                                   " 
  sql = sql + "  where                                                                                                                                  " 
  sql = sql + "       list IS NOT NULL and                                                                                                              " 
  sql = sql + "        to_char(seikyu.deliver_ymd,'yyyy') = '2019' and                                                                                  " 
  sql = sql + "        to_char(seikyu.deliver_ymd,'mm') = '12'                                                                                          " 
  sql = sql + "  ORDER  BY to_char(seikyu.deliver_ymd,'yyyy'),                                                                                          " 
  sql = sql + "            to_char(seikyu.deliver_ymd,'mm'),                                                                                            " 
  sql = sql + "            customer.list,                                                                                                               " 
  sql = sql + "            seikyu.customer_id,                                                                                                          " 
  sql = sql + "            seikyu.item_id,                                                                                                              " 
  sql = sql + "            seikyu.deliver_ymd;                                                                                                          " 


  sql = " select * from v_seikyu_b where nen = '2021' and tuki = '02' "

  if db.session.execute(text(sql)).fetchone() is not None:
    data_list = db.session.execute(text(sql))



    pdf_canvas = set_info(filename) # キャンバス名の設定
    print_string(pdf_canvas)
    print_string(pdf_canvas)

    for d in data_list:
      # print(d["customer_id"])
      pdf_canvas.showPage()                        # 1ページ目を確定
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
    
    # フォントを登録
    pdfmetrics.registerFont(UnicodeCIDFont('HeiseiKakuGo-W5'))
    
    print_waku_kihon(pdf_canvas)
    print_waku_subA(pdf_canvas)
    print_string_sub(pdf_canvas, 45, 45)
    print_string_sub(pdf_canvas, 45, 342)
    
def get_day_of_week_jp(dt):
    w_list = ['月', '火', '水', '木', '金', '土', '日']
    return(w_list[dt.weekday()])


def print_waku_subA(pdf_canvas):

    # 線幅を0.1へセット
    pdf_canvas.setLineWidth(0.5)
    
    pdf_canvas.rect(60, 10, 98, 22, stroke=1, fill=0)
    pdf_canvas.setFont(font_type, 14)
    pdf_canvas.drawString(68,26, '入  金  伝  票')
    
    pdf_canvas.rect(240, 10, 90, 22, stroke=1, fill=0)
    pdf_canvas.setFont(font_type, 14)
    pdf_canvas.drawString(252,26, '領   収   証')
    
    pdf_canvas.rect(540, 10, 100, 22, stroke=1, fill=0)
    pdf_canvas.setFont(font_type, 14)
    pdf_canvas.drawString(554,26, '請    求    書')

    pdf_canvas.rect(60, 10+297, 98, 22, stroke=1, fill=0)
    pdf_canvas.setFont(font_type, 14)
    pdf_canvas.drawString(68,26+297, '入  金  伝  票')
    
    pdf_canvas.rect(240, 10+297, 90, 22, stroke=1, fill=0)
    pdf_canvas.setFont(font_type, 14)
    pdf_canvas.drawString(252,26+297, '領   収   証')
    
    pdf_canvas.rect(540, 10+297, 100, 22, stroke=1, fill=0)
    pdf_canvas.setFont(font_type, 14)
    pdf_canvas.drawString(554,26+297, '請    求    書')


# 縦横線のみ
def print_waku_kihon(pdf_canvas):

    # ページサイズを取得
    page_height = defaultPageSize[0];
    page_width = defaultPageSize[1];
    
    # print(str(page_height))
    
    # 線幅を0.01へセット
    pdf_canvas.setLineWidth(0.01)
    
    # 横線
    pdf_canvas.line(0, page_height/2, page_width, page_height/2)
    
    # 縦線 左
    pdf_canvas.line(208, 0, 208, page_height)
    
    # 縦線 中央
    pdf_canvas.line(365, 0, 365, page_height)
    
# def stringWidth2(string, font, size, charspace):
#     width = stringWidth(string, font, size)
#     width += (len(string) - 1) * charspace
#     return width

def print_string_sub(pdf_canvas,start_x,start_y):


    def_font_size = 9
    def_font_type = 'HeiseiKakuGo-W5'
    
    pdf_canvas.setFillColorRGB(float(1)/255,float(1)/255,float(1)/255) 
    
    font_size = def_font_size
    pdf_canvas.setFont(def_font_type, font_size)
    pdf_canvas.drawString(start_x,         start_y+5, '24L')     # 左　顧客ID
    pdf_canvas.drawString(start_x+178,     start_y+5, '24C') # 中　顧客ID
    pdf_canvas.drawString(start_x+333,     start_y+5, '24R') # 右　顧客ID
    
    
    
    font_size = def_font_size+2
    pdf_canvas.setFont(def_font_type, font_size)
    pdf_canvas.drawString(start_x,         start_y+44, '片岡美容室L' + '　　様') 
    pdf_canvas.drawString(start_x+178,     start_y+44, '片岡美容室C' + '　　様') 
    pdf_canvas.drawString(start_x+178+155, start_y+19, '片岡美容室R' + '　　様') 
    
    # 顧客名のアンダーライン
    pdf_canvas.setLineWidth(0.5)
    pdf_canvas.line(start_x-2,         start_y+44+3,  start_x-2    +150, start_y+44+3)
    pdf_canvas.line(start_x+178-2,     start_y+44+3,  start_x+178-2+135, start_y+44+3)
    pdf_canvas.line(start_x+333-2,     start_y+19+3,  start_x+333-2+140, start_y+19+3)
    
    font_size = def_font_size+1
    pdf_canvas.setFont(def_font_type, font_size)
    pdf_canvas.drawString(start_x+37,      start_y+76, '　　　' + '令和3年' +'　' + '1月分') 
    pdf_canvas.drawString(start_x+37+158,  start_y+76, '　　　' + '令和3年' +'　' + '1月分') 
    pdf_canvas.drawString(start_x+510,     start_y+21, '令和3年' +'　' + '1月分') 
    
    
    font_size = def_font_size-1
    pdf_canvas.setFont(def_font_type, font_size)
    pdf_canvas.drawString(start_x+57,      start_y+106+10, '（本体' + '12,360' + ' + 税' + '18L' + '）') 
    pdf_canvas.drawString(start_x+218,     start_y+106+10, '（本体' + '12,360' + ' + 税' + '18C' + '）') 
    pdf_canvas.drawString(start_x+690,     start_y+2  , '（本体' + '12,360' + ' + 税' + '18R' + '）') 
    
    font_size = def_font_size+2
    pdf_canvas.setFont(def_font_type, font_size)
    pdf_canvas.drawString(start_x,          start_y+106+14+10, '請求額　　　　　' + '￥ 12,548') 
    pdf_canvas.drawString(start_x+178,      start_y+106+14+10, '領収金額　　　' + '￥ 12,548') 
    pdf_canvas.drawString(start_x+660,      start_y+20,        '御請求額　　' + '￥ 12,548') 
    
    # 請求額のアンダーライン
    pdf_canvas.setLineWidth(0.5)
    pdf_canvas.line(start_x-2,         start_y+106+14+3+10,  start_x-2    +150, start_y+106+14+3+10)
    pdf_canvas.line(start_x+178-2,     start_y+106+14+3+10,  start_x+178-2+135, start_y+106+14+3+10)
    pdf_canvas.line(start_x+660-2,     start_y+20    +3,  start_x+660-2+132, start_y+20    +3)
    
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
