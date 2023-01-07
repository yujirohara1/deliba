drop view v_order_month_total cascade;
CREATE VIEW v_order_month_total AS
select
    to_char(order_ymd,'yyyymm') yyyymm,
    sum(item_siire * quantity) total,
    tenant_id,
    min(order_ymd) min_ymd,
    max(order_ymd) max_ymd
from
    order_item
group by
    to_char(order_ymd,'yyyymm'),
    tenant_id
;

    



-- 
-- deliba::HEROKU_POSTGRESQL_SILVER=> \d order_item
--                                            テーブル"public.order_item"
--       列       |           タイプ            | 照合順序 | Null 値を許容 |               デフォルト
-- ---------------+-----------------------------+----------+---------------+----------------------------------------
--  id            | integer                     |          | not null      | nextval('order_item_id_seq'::regclass)
--  order_ymd     | date                        |          | not null      |
--  hope_ymd      | date                        |          | not null      |
--  item_id       | integer                     |          | not null      |
--  item_code     | character varying(20)       |          | not null      |
--  item_name1    | character varying(80)       |          | not null      |
--  item_siire    | numeric(10,3)               |          | not null      |
--  quantity      | integer                     |          | not null      |
--  send_stamp    | timestamp without time zone |          | not null      |
--  receive_stamp | timestamp without time zone |          |               |
--  tenant_id     | character varying(80)       |          | not null      |
-- インデックス:
--     "order_item_pkey" PRIMARY KEY, btree (send_stamp, item_id, tenant_id)
-- 
