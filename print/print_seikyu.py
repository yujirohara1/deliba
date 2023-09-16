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
import math

font_type = 'HeiseiKakuGo-W5'

def make(filename="resume", seikyulistA=None, seikyulistB=None, paramlist=None): # ファイル名の設定
#def make(filename="resume"): # ファイル名の設定


    pdf_canvas = set_info(filename) # キャンバス名の設定

    # フォントを登録
    pdfmetrics.registerFont(UnicodeCIDFont('HeiseiKakuGo-W5'))
    
    print_waku_kihon(pdf_canvas)
    print_waku_subA(pdf_canvas)

    print_string_sub(pdf_canvas, 43, 45, seikyulistA, paramlist)

    if seikyulistB!=None:
      print_string_sub(pdf_canvas, 43, 342, seikyulistB, paramlist)

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
    
    pdf_canvas.rect(60, 16, 98, 19, stroke=1, fill=0)
    pdf_canvas.setFont(font_type, 14)
    pdf_canvas.drawString(68,30, '入  金  伝  票')
    
    pdf_canvas.rect(240, 16, 90, 19, stroke=1, fill=0)
    pdf_canvas.setFont(font_type, 14)
    pdf_canvas.drawString(252,30, '領   収   証')
    
    pdf_canvas.rect(540, 16, 100, 19, stroke=1, fill=0)
    pdf_canvas.setFont(font_type, 14)
    pdf_canvas.drawString(554,30, '請    求    書')

    pdf_canvas.rect(60, 16+297, 98, 19, stroke=1, fill=0)
    pdf_canvas.setFont(font_type, 14)
    pdf_canvas.drawString(68,30+297, '入  金  伝  票')
    
    pdf_canvas.rect(240, 16+297, 90, 19, stroke=1, fill=0)
    pdf_canvas.setFont(font_type, 14)
    pdf_canvas.drawString(252,30+297, '領   収   証')
    
    pdf_canvas.rect(540, 16+297, 100, 19, stroke=1, fill=0)
    pdf_canvas.setFont(font_type, 14)
    pdf_canvas.drawString(554,30+297, '請    求    書')

    kijunY = 79

    # 【右】商品名等 見出し 上段
    pdf_canvas.setFont(font_type, 9)
    pdf_canvas.drawString(397,kijunY+21, '商　　品　　名')
    pdf_canvas.setFont(font_type, 8)
    pdf_canvas.drawString(477,kijunY+21, '数量')
    pdf_canvas.setFont(font_type, 9)
    pdf_canvas.drawString(502,kijunY+21, '単価')
    pdf_canvas.drawString(537,kijunY+21, '小　計')

    # 【右】商品名等 見出し 上段
    pdf_canvas.setFont(font_type, 9)
    pdf_canvas.drawString(397,kijunY+21+298, '商　　品　　名')
    pdf_canvas.setFont(font_type, 8)
    pdf_canvas.drawString(477,kijunY+21+298, '数量')
    pdf_canvas.setFont(font_type, 9)
    pdf_canvas.drawString(502,kijunY+21+298, '単価')
    pdf_canvas.drawString(537,kijunY+21+298, '小　計')

    kijunX = 373

    # 上段
    pdf_canvas.rect(kijunX, kijunY+12, 200, 13, stroke=1, fill=0) # 商品名等 見出し
    pdf_canvas.rect(kijunX, kijunY+25, 453, 76, stroke=1, fill=0) # 1~15の大枠
    pdf_canvas.rect(kijunX+200, kijunY+0, 253, 12, stroke=1, fill=0) # 1～15の日付　1,2,3,4,5,,,
    pdf_canvas.rect(kijunX+200, kijunY+12, 253, 13, stroke=1, fill=0) # 1～15の曜日　月火水木金土,,,
    pdf_canvas.rect(kijunX+104, kijunY+12, 18, 89, stroke=1, fill=0) # 1~15の大枠　本数を囲う縦長の四角
    pdf_canvas.rect(kijunX+152, kijunY+12, 48, 89, stroke=1, fill=0) # 1~15の大枠　商品小計を囲う縦長の四角

    pdf_canvas.rect(kijunX+183, kijunY+127, 270, 77, stroke=1, fill=0) # 16以降の大枠
    pdf_canvas.rect(kijunX+183, kijunY+101, 270, 13, stroke=1, fill=0) # 16以降の日付　1,2,3,4,5,,,
    pdf_canvas.rect(kijunX+183, kijunY+114, 270, 13, stroke=1, fill=0) # 16以降の曜日　月火水木金土,,,

    pdf_canvas.rect(kijunX+217, kijunY, 17, 101+103, stroke=1, fill=0) # 偶数日の縦四角1
    pdf_canvas.rect(kijunX+217+34, kijunY, 17, 101+103, stroke=1, fill=0) # 偶数日の縦四角2
    pdf_canvas.rect(kijunX+217+34+33, kijunY, 17, 101+103, stroke=1, fill=0) # 偶数日の縦四角2
    pdf_canvas.rect(kijunX+217+34+33+34, kijunY, 17, 101+103, stroke=1, fill=0) # 偶数日の縦四角2
    pdf_canvas.rect(kijunX+217+34+33+34+33, kijunY, 17, 101+103, stroke=1, fill=0) # 偶数日の縦四角2
    pdf_canvas.rect(kijunX+217+34+33+34+33+34, kijunY, 17, 101+103, stroke=1, fill=0) # 偶数日の縦四角2
    pdf_canvas.rect(kijunX+217+34+33+34+33+34+33, kijunY, 17, 101+103, stroke=1, fill=0) # 偶数日の縦四角2

    pdf_canvas.rect(kijunX+183, kijunY+101, 17, 103, stroke=1, fill=0) # 16日分の縦四角（下枠のみ）

    pdf_canvas.rect(kijunX, kijunY+37, 453, 13, stroke=1, fill=0) # 商品２の横枠 上
    pdf_canvas.rect(kijunX, kijunY+37+26, 453, 13, stroke=1, fill=0) # 商品２の横枠 上
    pdf_canvas.rect(kijunX, kijunY+37+26+26, 453, 12, stroke=1, fill=0) # 商品２の横枠 上

    pdf_canvas.rect(kijunX+183, kijunY+140, 270, 13, stroke=1, fill=0) # 商品２の横枠 下
    pdf_canvas.rect(kijunX+183, kijunY+140+26, 270, 13, stroke=1, fill=0) # 商品２の横枠 下
    pdf_canvas.rect(kijunX+183, kijunY+140+26+26, 270, 12, stroke=1, fill=0) # 商品２の横枠 下


    # 下段
    pdf_canvas.rect(kijunX, kijunY+12+297, 200, 13, stroke=1, fill=0) # 商品名等 見出し
    pdf_canvas.rect(kijunX, kijunY+25+297, 453, 76, stroke=1, fill=0) # 1~15の大枠
    pdf_canvas.rect(kijunX+200, kijunY+297, 253, 12, stroke=1, fill=0) # 1～15の日付　1,2,3,4,5,,,
    pdf_canvas.rect(kijunX+200, kijunY+12+297, 253, 13, stroke=1, fill=0) # 1～15の曜日　月火水木金土,,,
    pdf_canvas.rect(kijunX+104, kijunY+12+297, 18, 89, stroke=1, fill=0) # 1~15の大枠　本数を囲う縦長の四角
    pdf_canvas.rect(kijunX+152, kijunY+12+297, 48, 89, stroke=1, fill=0) # 1~15の大枠　商品小計を囲う縦長の四角

    pdf_canvas.rect(kijunX+183, kijunY+127+297, 270, 77, stroke=1, fill=0) # 16以降の大枠
    pdf_canvas.rect(kijunX+183, kijunY+101+297, 270, 13, stroke=1, fill=0) # 16以降の日付　1,2,3,4,5,,,
    pdf_canvas.rect(kijunX+183, kijunY+114+297, 270, 13, stroke=1, fill=0) # 16以降の曜日　月火水木金土,,,

    pdf_canvas.rect(kijunX+217, kijunY+297, 17, 101+103, stroke=1, fill=0) # 偶数日の縦四角1
    pdf_canvas.rect(kijunX+217+34, kijunY+297, 17, 101+103, stroke=1, fill=0) # 偶数日の縦四角2
    pdf_canvas.rect(kijunX+217+34+33, kijunY+297, 17, 101+103, stroke=1, fill=0) # 偶数日の縦四角2
    pdf_canvas.rect(kijunX+217+34+33+34, kijunY+297, 17, 101+103, stroke=1, fill=0) # 偶数日の縦四角2
    pdf_canvas.rect(kijunX+217+34+33+34+33, kijunY+297, 17, 101+103, stroke=1, fill=0) # 偶数日の縦四角2
    pdf_canvas.rect(kijunX+217+34+33+34+33+34, kijunY+297, 17, 101+103, stroke=1, fill=0) # 偶数日の縦四角2
    pdf_canvas.rect(kijunX+217+34+33+34+33+34+33, kijunY+297, 17, 101+103, stroke=1, fill=0) # 偶数日の縦四角2

    pdf_canvas.rect(kijunX+183, kijunY+101+297, 17, 103, stroke=1, fill=0) # 16日分の縦四角（下枠のみ）

    pdf_canvas.rect(kijunX, kijunY+37+297, 453, 13, stroke=1, fill=0) # 商品２の横枠 上
    pdf_canvas.rect(kijunX, kijunY+37+26+297, 453, 13, stroke=1, fill=0) # 商品２の横枠 上
    pdf_canvas.rect(kijunX, kijunY+37+26+26+297, 453, 12, stroke=1, fill=0) # 商品２の横枠 上

    pdf_canvas.rect(kijunX+183, kijunY+140+297, 270, 13, stroke=1, fill=0) # 商品２の横枠 下
    pdf_canvas.rect(kijunX+183, kijunY+140+26+297, 270, 13, stroke=1, fill=0) # 商品２の横枠 下
    pdf_canvas.rect(kijunX+183, kijunY+140+26+26+297, 270, 12, stroke=1, fill=0) # 商品２の横枠 下

    #【入金伝票のグリッド作成】
    # 【右】商品名等 見出し 上段
    pdf_canvas.setFont(font_type, 8)
    pdf_canvas.drawString(47,kijunY+124, '商　品　名')
    pdf_canvas.drawString(127,kijunY+124, '数量')
    pdf_canvas.drawString(145,kijunY+124, '単価')
    pdf_canvas.drawString(165,kijunY+124, '小　計')
    pdf_canvas.rect(45, kijunY+115, 150, 89, stroke=1, fill=0) #
    pdf_canvas.rect(45, kijunY+115+12, 150, 12, stroke=1, fill=0) #
    pdf_canvas.rect(45, kijunY+115+12+25, 150, 13, stroke=1, fill=0) #
    pdf_canvas.rect(45, kijunY+115+12+25+26, 150, 13, stroke=1, fill=0) #
    pdf_canvas.rect(126, kijunY+115, 18, 89, stroke=1, fill=0) #
    pdf_canvas.rect(144, kijunY+115, 19, 89, stroke=1, fill=0) #

    #【入金伝票のグリッド作成】
    # 【右】商品名等 見出し 下段
    pdf_canvas.setFont(font_type, 8)
    pdf_canvas.drawString(47,kijunY+124+297, '商　品　名')
    pdf_canvas.drawString(127,kijunY+124+297, '数量')
    pdf_canvas.drawString(145,kijunY+124+297, '単価')
    pdf_canvas.drawString(165,kijunY+124+297, '小　計')
    pdf_canvas.rect(45, kijunY+115+297, 150, 89, stroke=1, fill=0) #
    pdf_canvas.rect(45, kijunY+115+12+297, 150, 12, stroke=1, fill=0) #
    pdf_canvas.rect(45, kijunY+115+12+25+297, 150, 13, stroke=1, fill=0) #
    pdf_canvas.rect(45, kijunY+115+12+25+26+297, 150, 13, stroke=1, fill=0) #
    pdf_canvas.rect(126, kijunY+115+297, 18, 89, stroke=1, fill=0) #
    pdf_canvas.rect(144, kijunY+115+297, 19, 89, stroke=1, fill=0) #

# 縦横線のみ
def print_waku_kihon(pdf_canvas):

    # ページサイズを取得
    page_height = defaultPageSize[0]
    page_width = defaultPageSize[1]
    
    # print(str(page_height))
    
    # 線幅を0.01へセット
    pdf_canvas.setLineWidth(0.01)
    
    # 横線
    # pdf_canvas.line(0, page_height/2, page_width, page_height/2)
    
    # 縦線 左
    # pdf_canvas.line(208, 0, 208, page_height)
    
    # 縦線 中央
    # pdf_canvas.line(365, 0, 365, page_height)
    
# def stringWidth2(string, font, size, charspace):
#     width = stringWidth(string, font, size)
#     width += (len(string) - 1) * charspace
#     return width

def get_param_val(paramlist, id, no, colidx, datarow):
  for row in paramlist:
    if row.param_id == id and row.param_no == no:
      if colidx == 1:
        if (row.tenant_id == 'sato' and datarow["tanto"] == "3") and (id == "TENPO_RYOSYUSHO" or id == "TENPO_SEIKYUSHO"):
          return satoSpecial(id, no, row.param_val1)
        else:
          return row.param_val1
      if colidx == 2:
        return row.param_val2
  return ""

def satoSpecial(id, no, satoStr):
  if id == "TENPO_RYOSYUSHO":
    if no == 1:
      return "はら牛乳販売店"
    elif no == 2:
      return "新潟市南区下曲通１３３－１"
    elif no == 3:
      return "025-375-3018"
    else:
      return satoStr
  elif id == "TENPO_SEIKYUSHO":
    if no == 1:
      return "はら牛乳販売店"
    elif no == 2:
      return "新潟市南区下曲通１３３－１"
    elif no == 3:
      return "025-375-3018"
    else:
      return satoStr
  else:
    return satoStr

  # TENPO_RYOSYUSHO | 領収書の店舗情報 |        1 | はら牛乳販売店             |            |            | hara
  # TENPO_RYOSYUSHO | 領収書の店舗情報 |        2 | 新潟市南区下曲通１３３－１ |            |            | hara
  # TENPO_RYOSYUSHO | 領収書の店舗情報 |        3 | 025-375-3018               |            |            | hara
  # TENPO_SEIKYUSHO | 請求書の店舗情報 |        1 | はら牛乳販売店             |            |            | hara
  # TENPO_SEIKYUSHO | 請求書の店舗情報 |        2 | 新潟市南区下曲通１３３－１ |            |            | hara
  # TENPO_SEIKYUSHO | 請求書の店舗情報 |        3 | 025-375-3018               |            |            | hara



def print_string_sub(pdf_canvas, start_x, start_y, data, paramlist):

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
  zeikb = 0
  for row in data:

    gyoNo = gyoNo + 1

    if gyoNo == 1 :

      zeikb = int(row["zei_kb"])

      # 顧客ID
      font_size = def_font_size
      pdf_canvas.setFont(def_font_type, font_size)
      pdf_canvas.drawString(start_x,         start_y+5, str(row["customer_id"])) # 左　顧客ID
      pdf_canvas.drawString(start_x+178,     start_y+5, str(row["customer_id"])) # 中　顧客ID
      pdf_canvas.drawString(start_x+333,     start_y+5, str(row["customer_id"])) # 右　顧客ID

      # 氏名
      font_size = def_font_size+2
      pdf_canvas.setFont(def_font_type, font_size)
      pdf_canvas.drawString(start_x,         start_y+44, row["customer_name1"] + '　　様') 
      pdf_canvas.drawString(start_x+178,     start_y+44, row["customer_name1"] + '　　様') 
      pdf_canvas.drawString(start_x+178+155, start_y+19, row["customer_name1"] + '　　様') 

       # 顧客名のアンダーライン
      pdf_canvas.setLineWidth(0.5)
      pdf_canvas.line(start_x-2,         start_y+44+3,  start_x-2    +150, start_y+44+3)
      pdf_canvas.line(start_x+178-2,     start_y+44+3,  start_x+178-2+135, start_y+44+3)
      pdf_canvas.line(start_x+333-2,     start_y+19+3,  start_x+333-2+140, start_y+19+3)

      # ○年○月分
      font_size = def_font_size+1
      pdf_canvas.setFont(def_font_type, font_size)
      pdf_canvas.drawString(start_x+37,      start_y+76, '　　　' + row["nen"] +'年　' + row["tuki"] + '月分') 
      pdf_canvas.drawString(start_x+37+158,  start_y+76, '　　　' + row["nen"] +'年　' + row["tuki"] + '月分') 
      pdf_canvas.drawString(start_x+510,     start_y+21, row["nen"] +'年　' + row["tuki"] + '月分') 

      # 請求額のアンダーライン
      pdf_canvas.setLineWidth(0.5)
      pdf_canvas.line(start_x-2,         start_y+106+14+3+10,  start_x-2    +150, start_y+106+14+3+10)
      pdf_canvas.line(start_x+178-2,     start_y+106+14+3+10,  start_x+178-2+135, start_y+106+14+3+10)
      pdf_canvas.line(start_x+660-2,     start_y+20    +3,  start_x+660-2+132, start_y+20    +3)

      font_size = def_font_size
      pdf_canvas.setFont(def_font_type, font_size)
      comment = get_param_val(paramlist, "COMMENT_SEIKYU", int(row["harai_kb"]), 1, row).split(";br")

      pdf_canvas.drawString(start_x+178+155+6, start_y+170, comment[0])
      if len(comment)==2: 
        pdf_canvas.drawString(start_x+178+155+6, start_y+181, comment[1]) 

      if len(comment)==3: 
        pdf_canvas.drawString(start_x+178+155+6, start_y+181, comment[1]) 
        pdf_canvas.drawString(start_x+178+155+6, start_y+192, comment[2]) 
      
      pdf_canvas.setFont(def_font_type, def_font_size+6)
      pdf_canvas.drawString(start_x+178+155, start_y+200, get_param_val(paramlist, "TENPO_SEIKYUSHO", 1, 1, row) ) 
      pdf_canvas.setFont(def_font_type, def_font_size+1)
      pdf_canvas.drawString(start_x+178+155, start_y+200+12, get_param_val(paramlist, "TENPO_SEIKYUSHO", 2, 1, row) ) 
      pdf_canvas.setFont(def_font_type, def_font_size)
      pdf_canvas.drawString(start_x+178+155, start_y+200+12+12, get_param_val(paramlist, "TENPO_SEIKYUSHO", 3, 1, row) ) 
      pdf_canvas.setFont(def_font_type, def_font_size)
      pdf_canvas.drawString(start_x+178+155, start_y+200+12+12+12, get_param_val(paramlist, "TENPO_SEIKYUSHO", 4, 1, row) ) 

      # カレンダー 1日～15日 見出し
      font_size = def_font_size-1
      pdf_canvas.setFont(def_font_type, font_size)
      pdf_canvas.setFillColorRGB(float(1)/255,float(1)/255,float(255)/255) 
      for i in range(15):
        pdf_canvas.drawString(start_x+517+((i+1)*16.8),         start_y+44, str(i+1).rjust(2)) 

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
        if isDate(int(row["nen"]), int(row["tuki"]), i+16):
          dt = datetime.datetime(int(row["nen"]), int(row["tuki"]), i+16)
          pdf_canvas.drawString(start_x+500+((i+1)*16.9),         start_y+146, str(i+16)) 

      font_size = def_font_size
      pdf_canvas.setFont(def_font_type, font_size)
      pdf_canvas.setFillColorRGB(float(1)/255,float(1)/255,float(255)/255) 
      for i in range(16):
        if isDate(int(row["nen"]), int(row["tuki"]), i+16):
          dt = datetime.datetime(int(row["nen"]), int(row["tuki"]), i+16)
          pdf_canvas.drawString(start_x+500+((i+1)*16.9),         start_y+159, get_day_of_week_jp(dt)) 

    quantityShokei = 0
    pdf_canvas.setFillColorRGB(float(1)/255,float(1)/255,float(1)/255) 
    if itemId != row["item_id"] :
      itemCnt = itemCnt + 1
      itemQuantity[itemCnt] = 0
      itemTanka[itemCnt] = row["price"]
      font_size = def_font_size-2
      pdf_canvas.setFont(def_font_type, font_size)
      
      pdf_canvas.drawString(start_x+3,       start_y+157 + (itemCnt*13),    row["item_name1"])  # item_name1
      pdf_canvas.drawString(start_x+3+95,    start_y+157 + (itemCnt*13),    kingakuFormat(row["price"]))
      font_size = def_font_size-1
      pdf_canvas.setFont(def_font_type, font_size)
      pdf_canvas.drawString(start_x+178+155+2, start_y+55 + (itemCnt*13), row["item_name1"])  # item_name1
      pdf_canvas.drawString(start_x+178+155+123, start_y+55 + (itemCnt*13),   kingakuFormat(row["price"]))
      
      itemId = row["item_id"]

    # カレンダー 1日～15日 本数
    font_size = def_font_size-1
    pdf_canvas.setFont(def_font_type, font_size)

    d = int(row["deliver_ymd"].strftime("%d"))
    if 1 <= d and d <= 15 :
      pdf_canvas.drawString(start_x+517+((d)*16.8),         (start_y+55)+(itemCnt*13), str(ZeroToYasumi(row["quantity"])).rjust(2)) 
      itemQuantity[itemCnt] = tonum(itemQuantity.get(itemCnt)) +  row["quantity"]
    if 16 <= d and d <= 31 :
      pdf_canvas.drawString(start_x+500+((d-15)*16.9),         (start_y+159)+(itemCnt*13), str(ZeroToYasumi(row["quantity"])).rjust(2)) 
      itemQuantity[itemCnt] = tonum(itemQuantity.get(itemCnt)) +  row["quantity"]
  
  font_size = def_font_size-2
  pdf_canvas.setFont(def_font_type, font_size)
  seikyuKei = 0
  for num in range(1, 7):
    if itemQuantity.get(num) != None:
      pdf_canvas.drawString(start_x+3+80,    start_y+157 + (num*13),    quantityFormat(itemQuantity.get(num))) 
      pdf_canvas.drawString(start_x+3+120,    start_y+157 + (num*13),    kingakuFormat(itemQuantity.get(num) * itemTanka.get(num))) 
      pdf_canvas.drawString(start_x+178+155+103, start_y+55 + (num*13),    quantityFormat(itemQuantity.get(num))) 
      pdf_canvas.drawString(start_x+178+155+170, start_y+55 + (num*13),     kingakuFormat(itemQuantity.get(num) * itemTanka.get(num))) 
      seikyuKei = seikyuKei + itemQuantity.get(num) * itemTanka.get(num)

  font_size = def_font_size-1
  pdf_canvas.setFont(def_font_type, font_size)
  if zeikb == 2:
    zeigaku = 0
    pdf_canvas.drawString(start_x+57+65,      start_y+106+10, '（税込）') 
    pdf_canvas.drawString(start_x+218+65,     start_y+106+10, '（税込）') 
    pdf_canvas.drawString(start_x+690+65,     start_y+2  ,    '（税込）') 
  else:
    zeigaku = math.floor(seikyuKei*0.08)
    pdf_canvas.drawString(start_x+57,      start_y+106+10, '（本体' + kingakuFormat(seikyuKei) + ' + 税' + kingakuFormat(zeigaku) + '）') 
    pdf_canvas.drawString(start_x+213,     start_y+106+10, '（本体' + kingakuFormat(seikyuKei) + ' + 税' + kingakuFormat(zeigaku) + '）') 
    pdf_canvas.drawString(start_x+680,     start_y+2  , '（本体' + kingakuFormat(seikyuKei) + ' + 税' + kingakuFormat(zeigaku) + '）') 
    
  font_size = def_font_size+2
  pdf_canvas.setFont(def_font_type, font_size)
  pdf_canvas.drawString(start_x,          start_y+106+14+10, '請求額　　　　　' + '￥ '+ kingakuFormat(seikyuKei+zeigaku)) 
  pdf_canvas.drawString(start_x+178,      start_y+106+14+10, '領収金額　　　' + '￥ '+ kingakuFormat(seikyuKei+zeigaku)) 
  pdf_canvas.drawString(start_x+660,      start_y+20,        '御請求額　　' + '￥ '+ kingakuFormat(seikyuKei+zeigaku)) 

  font_size = def_font_size+5
  pdf_canvas.setFont(def_font_type, font_size)
  pdf_canvas.drawString(start_x+178+155+10, start_y+155, '御請求額　￥'+kingakuFormat(seikyuKei+zeigaku)) 
  
  #比較用のライン
  pdf_canvas.setLineWidth(0.5)
  pdf_canvas.line(start_x+339, start_y+157, start_x+485, start_y+157)
  
  # 領収書の固定文字
  pdf_canvas.setFont(def_font_type, def_font_size)
  pdf_canvas.drawString(start_x+178,      start_y+106+14+10+30, '上記の金額正に領収致しました。') 
  pdf_canvas.drawString(start_x+178,      start_y+106+14+10+30+20, '　　　　　年　　　月　　　日') 

  pdf_canvas.setFont(def_font_type, def_font_size+6)
  pdf_canvas.drawString(start_x+178+2, start_y+206, get_param_val(paramlist, "TENPO_RYOSYUSHO", 1, 1, row) ) #'デモ牛乳販売店') 
  pdf_canvas.setFont(def_font_type, def_font_size+1)
  pdf_canvas.drawString(start_x+178+2, start_y+206+15, get_param_val(paramlist, "TENPO_RYOSYUSHO", 2, 1, row) ) 
  pdf_canvas.setFont(def_font_type, def_font_size)
  pdf_canvas.drawString(start_x+178+2, start_y+206+15+15, get_param_val(paramlist, "TENPO_RYOSYUSHO", 3, 1, row) ) 



def tonum(val):
  if val==None:
    return 0
  else:
    return int(val)
  
def kingakuFormat(val):
  return "{:,}".format(val).rjust(5)

def ZeroToYasumi(val):
  if val==0:
    return "＊"
  else:
    return val

def quantityFormat(val):
  return str(val).rjust(3)

# 1:外税／2:内税
def IsUchizei(zeikb) :
  if zeikb == '2':
    return True
  else :
    return False
      
def isDate(year,month,day):
    try:
        newDataStr="%04d/%02d/%02d"%(year,month,day)
        newDate=datetime.datetime.strptime(newDataStr,"%Y/%m/%d")
        return True
    except ValueError:
        return False
