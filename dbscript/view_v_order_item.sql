drop view v_order_item cascade;
CREATE VIEW v_order_item AS
select
    min(id) id,
    min(lpad(code,4,'0')) code,
    name1,
    orosine tanka,
    tenant_id,
    orderable
from
    item
where
    coalesce(del_flg,0) = 0 and
    orosine > 0 
group by
    name1,
    orosine,
    tenant_id,
    orderable
order by code
;
-- 
--     列     |        タイプ         | 照合順序 | Null 値を許容 |            デフォルト
-- -----------+-----------------------+----------+---------------+----------------------------------
--  id        | integer               |          | not null      | nextval('item_id_seq'::regclass)
--  code      | character varying(20) |          | not null      |
--  name1     | character varying(80) |          | not null      |
--  name2     | character varying(80) |          |               |
--  tanka     | integer               |          |               |
--  orosine   | numeric(10,3)         |          |               |
--  zei_kb    | integer               |          |               |
--  del_flg   | integer               |          |               |
--  tenant_id | character varying(80) |          | not null      | 'demo'::character varying
-- インデックス:
--     "item_pkey" PRIMARY KEY, btree (id, tenant_id)
--     "item_id_idx" btree (id)
--     "item_id_idx1" btree (id)
