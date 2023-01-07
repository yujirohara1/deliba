drop view v_ordered_group cascade;
CREATE VIEW v_ordered_group AS
select
    send_stamp,
    tenant_id,
    min(id) min_id,
    max(id) max_id,
    order_ymd,
    hope_ymd,
    count(1) kensu,
    sum(item_siire*quantity) total,
    max(receive_stamp) receive_stamp,
    array_to_string(array_agg(distinct item_name1 || '(' || quantity || ')'),', ') biko
from
    order_item
group by
    send_stamp,
    tenant_id,
    order_ymd,
    hope_ymd
order by
    send_stamp
;


select * from v_ordered_group;


-- newdb3=# \d v_ordered_group
--                            ビュー"public.v_ordered_group"
--       列       |           タイプ            | 照合順序 | Null 値を許容 | デフォルト
-- ---------------+-----------------------------+----------+---------------+------------
--  send_stamp    | timestamp without time zone |          |               |
--  min_id        | integer                     |          |               |
--  max_id        | integer                     |          |               |
--  order_ymd     | date                        |          |               |
--  hope_ymd      | date                        |          |               |
--  kensu         | bigint                      |          |               |
--  total         | numeric                     |          |               |
--  receive_stamp | timestamp without time zone |          |               |

