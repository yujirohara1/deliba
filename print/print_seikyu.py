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

def make(filename="resume", seikyulistA=None, seikyulistB=None): # ファイル名の設定
#def make(filename="resume"): # ファイル名の設定


    pdf_canvas = set_info(filename) # キャンバス名の設定

    # フォントを登録
    pdfmetrics.registerFont(UnicodeCIDFont('HeiseiKakuGo-W5'))
    
    print_waku_kihon(pdf_canvas)
    print_waku_subA(pdf_canvas)

    print_string_sub(pdf_canvas, 45, 45, seikyulistA)

    if seikyulistB!=None:
      print_string_sub(pdf_canvas, 45, 342, seikyulistB)

    pdf_canvas.save() # pdfを保存

def set_info(filename): 
    pdf_canvas = canvas.Canvas("./tmp/{0}.pdf".format(filename), pagesize=landscape(A4), bottomup=False) # 保存先の設定 bottomup=Falseで座標の始点を左上へ変更
    # ファイル情報の登録（任意）
    pdf_canvas.setAuthor("") # 作者
    pdf_canvas.setTitle("") # 表題
    pdf_canvas.setSubject("") # 件名
    return pdf_canvas


# def print_string(pdf_canvas):
    
#     # フォントを登録
#     pdfmetrics.registerFont(UnicodeCIDFont('HeiseiKakuGo-W5'))
    
#     print_waku_kihon(pdf_canvas)
#     print_waku_subA(pdf_canvas)
#     print_string_sub(pdf_canvas, 45, 45)
#     print_string_sub(pdf_canvas, 45, 342)
    
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
    page_height = defaultPageSize[0]
    page_width = defaultPageSize[1]
    
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

def print_string_sub(pdf_canvas, start_x, start_y, data):

  def_font_size = 9
  def_font_type = 'HeiseiKakuGo-W5'
  
  pdf_canvas.setFillColorRGB(float(1)/255,float(1)/255,float(1)/255) 
  
  gyoNo = 0
  itemId = 0
  itemCnt = 0
  itemKazuKei = 0
  itemKinKei = 0
  itemQuantity = {}
  itemTanka = {}
  for row in data:

    gyoNo = gyoNo + 1

    if gyoNo == 1 :

      # 顧客ID
      font_size = def_font_size
      pdf_canvas.setFont(def_font_type, font_size)
      pdf_canvas.drawString(start_x,         start_y+5, str(row["customer_id"]))     # 左　顧客ID
      pdf_canvas.drawString(start_x+178,     start_y+5, str(row["customer_id"])) # 中　顧客ID
      pdf_canvas.drawString(start_x+333,     start_y+5, str(row["customer_id"])) # 右　顧客ID
# 
      # 氏名
      font_size = def_font_size+2
      pdf_canvas.setFont(def_font_type, font_size)
      pdf_canvas.drawString(start_x,         start_y+44, row["customer_name1"] + '　　様') 
      pdf_canvas.drawString(start_x+178,     start_y+44, row["customer_name1"] + '　　様') 
      pdf_canvas.drawString(start_x+178+155, start_y+19, row["customer_name1"] + '　　様') 
# 
       # 顧客名のアンダーライン
      pdf_canvas.setLineWidth(0.5)
      pdf_canvas.line(start_x-2,         start_y+44+3,  start_x-2    +150, start_y+44+3)
      pdf_canvas.line(start_x+178-2,     start_y+44+3,  start_x+178-2+135, start_y+44+3)
      pdf_canvas.line(start_x+333-2,     start_y+19+3,  start_x+333-2+140, start_y+19+3)
# 
      # ○年○月分
      font_size = def_font_size+1
      pdf_canvas.setFont(def_font_type, font_size)
      pdf_canvas.drawString(start_x+37,      start_y+76, '　　　' + row["nen"] +'年　' + row["tuki"] + '月分') 
      pdf_canvas.drawString(start_x+37+158,  start_y+76, '　　　' + row["nen"] +'年　' + row["tuki"] + '月分') 
      pdf_canvas.drawString(start_x+510,     start_y+21, row["nen"] +'年　' + row["tuki"] + '月分') 

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
        dt = datetime.datetime(int(row["nen"]), int(row["tuki"]), i+1)
        pdf_canvas.drawString(start_x+517+((i+1)*16.8),         start_y+57, get_day_of_week_jp(dt)) 

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
        dt = datetime.datetime(int(row["nen"]), int(row["tuki"]), i+16)
        pdf_canvas.drawString(start_x+500+((i+1)*16.9),         start_y+159, get_day_of_week_jp(dt)) 

    quantityShokei = 0
    if itemId != row["item_id"] :
      itemCnt = itemCnt + 1
      itemQuantity[itemCnt] = 0
      itemTanka[itemCnt] = row["price"]
      font_size = def_font_size-2
      pdf_canvas.setFont(def_font_type, font_size)
      
      pdf_canvas.drawString(start_x+3,       start_y+157 + (itemCnt*13),    row["item_name1"])  # item_name1
      # pdf_canvas.drawString(start_x+3+80,    start_y+157 + (itemCnt*13),    '8') 
      pdf_canvas.drawString(start_x+3+95,    start_y+157 + (itemCnt*13),    str(row["price"]))
      font_size = def_font_size-1
      pdf_canvas.setFont(def_font_type, font_size)
      pdf_canvas.drawString(start_x+178+155+2, start_y+55 + (itemCnt*13), row["item_name1"])  # item_name1
      pdf_canvas.drawString(start_x+178+155+103, start_y+55 + (itemCnt*13),    '10') 
      pdf_canvas.drawString(start_x+178+155+123, start_y+55 + (itemCnt*13),   str(row["price"]))
      
      pdf_canvas.drawString(start_x+178+155+170, start_y+55 + (itemCnt*13),    '　110') 
      
      itemId = row["item_id"]

    # カレンダー 1日～15日 本数
    font_size = def_font_size-1
    pdf_canvas.setFont(def_font_type, font_size)
    pdf_canvas.setFillColorRGB(float(1)/255,float(1)/255,float(1)/255) 

    d = int(row["deliver_ymd"].strftime("%d"))
    if 1 <= d and d <= 15 :
      pdf_canvas.drawString(start_x+517+((d)*16.8),         (start_y+55)+(itemCnt*13), str(row["quantity"])) 
      itemQuantity[itemCnt] = tonum(itemQuantity.get(itemCnt)) +  row["quantity"]
    if 16 <= d and d <= 31 :
      pdf_canvas.drawString(start_x+500+((d-15)*16.9),         (start_y+159)+(itemCnt*13), str(row["quantity"])) 
      itemQuantity[itemCnt] = tonum(itemQuantity.get(itemCnt)) +  row["quantity"]


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
  
  
  font_size = def_font_size-2
  pdf_canvas.setFont(def_font_type, font_size)
  for num in range(1, 6):
    if itemQuantity.get(num) != None:
      pdf_canvas.drawString(start_x+3+80,    start_y+157 + (num*13),    str(itemQuantity.get(num))) 
      pdf_canvas.drawString(start_x+3+120,    start_y+157 + (num*13),    str(itemQuantity.get(num) * itemTanka.get(num))) 

def tonum(val):
  if val==None:
    return 0
  else:
    return int(val)