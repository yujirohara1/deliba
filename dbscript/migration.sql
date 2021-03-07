--pg_dump -d データベース名 -s -h ホスト名 -U ユーザー > aaabbb.sql
--dropdb deliba_db

--psql -U postgres でログイン
--drop database deliba_db; #データベース削除

--シェルで実行
--createdb -O postgres -U postgres deliba_db

--psql -U postgres deliba_db

--
-- PostgreSQL database dump
--

-- Dumped from database version 12.5 (Ubuntu 12.5-1.pgdg20.04+1)
-- Dumped by pg_dump version 13.1
--
--SET statement_timeout = 0;
--SET lock_timeout = 0;
--SET idle_in_transaction_session_timeout = 0;
--SET client_encoding = 'UTF8';
--SET standard_conforming_strings = on;
--SELECT pg_catalog.set_config('search_path', '', false);
--SET check_function_bodies = false;
--SET xmloption = content;
--SET client_min_messages = warning;
--SET row_security = off;
--
--SET default_tablespace = '';
--
--SET default_table_access_method = heap;
--
--
-- Name: customer; Type: TABLE; Schema: public; Owner: lgnucurqlirpyu
--

drop VIEW v_daicho_a ;
drop VIEW v_seikyu_a ;
drop VIEW v_seikyu_b ;
drop VIEW v_seikyu_c ;
drop VIEW v_item_group ;

--drop table customer cascade;
--drop table item cascade;
--drop table daicho cascade;
--drop table seikyu cascade;
--drop table mst_setting cascade;
--
--

CREATE TABLE customer (
    id integer NOT NULL,
    name1 character varying(80),
    name2 character varying(80),
    address1 character varying(80),
    address2 character varying(80),
    address3 character varying(80),
    tel1 character varying(20),
    tel2 character varying(20),
    group_id integer,
    list integer,
    keiyaku_ymd date,
    start_ymd date,
    end_ymd date,
    stop_ymd date,
    harai_kb integer,
    zei_kb integer,
    del_flg integer,
    biko1 character varying(40),
    biko2 character varying(40),
    biko3 character varying(40),
    tenant_id character varying(80) not null
);

--
-- Name: customer_id_seq; Type: SEQUENCE; Schema: public; Owner: lgnucurqlirpyu
--

CREATE SEQUENCE customer_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: customer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lgnucurqlirpyu
--

--
-- Name: daicho; Type: TABLE; Schema: public; Owner: lgnucurqlirpyu
--

CREATE TABLE daicho (
    customer_id integer NOT NULL,
    item_id integer NOT NULL,
    youbi integer NOT NULL,
    quantity integer,
    tenant_id character varying(80) not null
);


--
-- Name: item; Type: TABLE; Schema: public; Owner: lgnucurqlirpyu
--

CREATE TABLE item (
    id integer NOT NULL,
    code character varying(20) NOT NULL,
    name1 character varying(80) NOT NULL,
    name2 character varying(80),
    tanka integer,
    orosine numeric(10,3),
    zei_kb integer,
    del_flg integer,
    tenant_id character varying(80) not null
);

--
-- Name: item_id_seq; Type: SEQUENCE; Schema: public; Owner: lgnucurqlirpyu
--

CREATE SEQUENCE item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lgnucurqlirpyu
--

--
-- Name: mst_setting; Type: TABLE; Schema: public; Owner: lgnucurqlirpyu
--

CREATE TABLE mst_setting (
    param_id character varying(30) NOT NULL,
    param_nm character varying(80) NOT NULL,
    param_no integer NOT NULL,
    param_val1 character varying(200) NOT NULL,
    param_val2 character varying(200),
    param_val3 character varying(200),
    tenant_id character varying(80) not null
);

--
-- Name: seikyu; Type: TABLE; Schema: public; Owner: lgnucurqlirpyu
--

CREATE TABLE seikyu (
    customer_id integer NOT NULL,
    deliver_ymd date NOT NULL,
    item_id integer NOT NULL,
    price integer NOT NULL,
    price_sub integer,
    quantity integer NOT NULL,
    user_id character varying(20) NOT NULL,
    ymdt timestamp without time zone NOT NULL,
    tenant_id character varying(80) not null
);



CREATE TABLE kakute (
    nen integer NOT NULL,
    tuki integer NOT NULL,
    customer_id integer NOT NULL,
    kakute_ymdt timestamp without time zone ,
    nyukin_ymdt timestamp without time zone ,
    tenant_id character varying(80) not null
);

--
-- Name: v_daicho_a; Type: VIEW; Schema: public; Owner: lgnucurqlirpyu
--


CREATE VIEW v_daicho_a AS
 SELECT customer.group_id,
    customer.list,
    daicho.customer_id,
    '1'::text AS tenpo,
    customer.name1 AS cname1,
    customer.name2 AS cname2,
    customer.address1,
    customer.address2,
    customer.address3,
    customer.harai_kb,
    customer.del_flg AS cdelflg,
    daicho.item_id,
    item.code AS icode,
    item.name1 AS iname1,
    item.name2 AS iname2,
    item.tanka,
    item.del_flg AS idelflg,
    sum(
        CASE
            WHEN (daicho.youbi = 1) THEN daicho.quantity
            ELSE 0
        END) AS getu,
    sum(
        CASE
            WHEN (daicho.youbi = 2) THEN daicho.quantity
            ELSE 0
        END) AS ka,
    sum(
        CASE
            WHEN (daicho.youbi = 3) THEN daicho.quantity
            ELSE 0
        END) AS sui,
    sum(
        CASE
            WHEN (daicho.youbi = 4) THEN daicho.quantity
            ELSE 0
        END) AS moku,
    sum(
        CASE
            WHEN (daicho.youbi = 5) THEN daicho.quantity
            ELSE 0
        END) AS kin,
    sum(
        CASE
            WHEN (daicho.youbi = 6) THEN daicho.quantity
            ELSE 0
        END) AS dou,
    sum(
        CASE
            WHEN (daicho.youbi = 7) THEN daicho.quantity
            ELSE 0
        END) AS niti,
    sum(daicho.quantity) AS total,
    daicho.tenant_id
   FROM ((daicho
     LEFT JOIN customer ON ((daicho.customer_id = customer.id and daicho.tenant_id = customer.tenant_id)))
     LEFT JOIN item ON ((daicho.item_id = item.id and daicho.tenant_id = item.tenant_id)))
  WHERE ((customer.list IS NOT NULL) AND (customer.del_flg = 0))
  GROUP BY customer.group_id, customer.list, daicho.customer_id, customer.name1, customer.name2, customer.address1, customer.address2, customer.address3, customer.harai_kb, customer.del_flg, daicho.item_id, item.code, item.name1, item.name2, item.tanka, item.del_flg, daicho.tenant_id
  ORDER BY customer.group_id, customer.list, item.code;

--
-- Name: v_seikyu_a; Type: VIEW; Schema: public; Owner: lgnucurqlirpyu
--

CREATE VIEW v_seikyu_a AS
 SELECT sei.customer_id,
    to_char((sei.deliver_ymd)::timestamp with time zone, 'yyyy'::text) AS nen,
    to_char((sei.deliver_ymd)::timestamp with time zone, 'mm'::text) AS tuki,
    sei.item_id,
    item.name1 AS item_name1,
    sei.price,
    sei.price_sub,
    sum(
        CASE
            WHEN (to_char((sei.deliver_ymd)::timestamp with time zone, 'dd'::text) = '01'::text) THEN sei.quantity
            ELSE NULL::integer
        END) AS quantity_d01,
    sum(
        CASE
            WHEN (to_char((sei.deliver_ymd)::timestamp with time zone, 'dd'::text) = '02'::text) THEN sei.quantity
            ELSE NULL::integer
        END) AS quantity_d02,
    sum(
        CASE
            WHEN (to_char((sei.deliver_ymd)::timestamp with time zone, 'dd'::text) = '03'::text) THEN sei.quantity
            ELSE NULL::integer
        END) AS quantity_d03,
    sum(
        CASE
            WHEN (to_char((sei.deliver_ymd)::timestamp with time zone, 'dd'::text) = '04'::text) THEN sei.quantity
            ELSE NULL::integer
        END) AS quantity_d04,
    sum(
        CASE
            WHEN (to_char((sei.deliver_ymd)::timestamp with time zone, 'dd'::text) = '05'::text) THEN sei.quantity
            ELSE NULL::integer
        END) AS quantity_d05,
    sum(
        CASE
            WHEN (to_char((sei.deliver_ymd)::timestamp with time zone, 'dd'::text) = '06'::text) THEN sei.quantity
            ELSE NULL::integer
        END) AS quantity_d06,
    sum(
        CASE
            WHEN (to_char((sei.deliver_ymd)::timestamp with time zone, 'dd'::text) = '07'::text) THEN sei.quantity
            ELSE NULL::integer
        END) AS quantity_d07,
    sum(
        CASE
            WHEN (to_char((sei.deliver_ymd)::timestamp with time zone, 'dd'::text) = '08'::text) THEN sei.quantity
            ELSE NULL::integer
        END) AS quantity_d08,
    sum(
        CASE
            WHEN (to_char((sei.deliver_ymd)::timestamp with time zone, 'dd'::text) = '09'::text) THEN sei.quantity
            ELSE NULL::integer
        END) AS quantity_d09,
    sum(
        CASE
            WHEN (to_char((sei.deliver_ymd)::timestamp with time zone, 'dd'::text) = '10'::text) THEN sei.quantity
            ELSE NULL::integer
        END) AS quantity_d10,
    sum(
        CASE
            WHEN (to_char((sei.deliver_ymd)::timestamp with time zone, 'dd'::text) = '11'::text) THEN sei.quantity
            ELSE NULL::integer
        END) AS quantity_d11,
    sum(
        CASE
            WHEN (to_char((sei.deliver_ymd)::timestamp with time zone, 'dd'::text) = '12'::text) THEN sei.quantity
            ELSE NULL::integer
        END) AS quantity_d12,
    sum(
        CASE
            WHEN (to_char((sei.deliver_ymd)::timestamp with time zone, 'dd'::text) = '13'::text) THEN sei.quantity
            ELSE NULL::integer
        END) AS quantity_d13,
    sum(
        CASE
            WHEN (to_char((sei.deliver_ymd)::timestamp with time zone, 'dd'::text) = '14'::text) THEN sei.quantity
            ELSE NULL::integer
        END) AS quantity_d14,
    sum(
        CASE
            WHEN (to_char((sei.deliver_ymd)::timestamp with time zone, 'dd'::text) = '15'::text) THEN sei.quantity
            ELSE NULL::integer
        END) AS quantity_d15,
    sum(
        CASE
            WHEN (to_char((sei.deliver_ymd)::timestamp with time zone, 'dd'::text) = '16'::text) THEN sei.quantity
            ELSE NULL::integer
        END) AS quantity_d16,
    sum(
        CASE
            WHEN (to_char((sei.deliver_ymd)::timestamp with time zone, 'dd'::text) = '17'::text) THEN sei.quantity
            ELSE NULL::integer
        END) AS quantity_d17,
    sum(
        CASE
            WHEN (to_char((sei.deliver_ymd)::timestamp with time zone, 'dd'::text) = '18'::text) THEN sei.quantity
            ELSE NULL::integer
        END) AS quantity_d18,
    sum(
        CASE
            WHEN (to_char((sei.deliver_ymd)::timestamp with time zone, 'dd'::text) = '19'::text) THEN sei.quantity
            ELSE NULL::integer
        END) AS quantity_d19,
    sum(
        CASE
            WHEN (to_char((sei.deliver_ymd)::timestamp with time zone, 'dd'::text) = '20'::text) THEN sei.quantity
            ELSE NULL::integer
        END) AS quantity_d20,
    sum(
        CASE
            WHEN (to_char((sei.deliver_ymd)::timestamp with time zone, 'dd'::text) = '21'::text) THEN sei.quantity
            ELSE NULL::integer
        END) AS quantity_d21,
    sum(
        CASE
            WHEN (to_char((sei.deliver_ymd)::timestamp with time zone, 'dd'::text) = '22'::text) THEN sei.quantity
            ELSE NULL::integer
        END) AS quantity_d22,
    sum(
        CASE
            WHEN (to_char((sei.deliver_ymd)::timestamp with time zone, 'dd'::text) = '23'::text) THEN sei.quantity
            ELSE NULL::integer
        END) AS quantity_d23,
    sum(
        CASE
            WHEN (to_char((sei.deliver_ymd)::timestamp with time zone, 'dd'::text) = '24'::text) THEN sei.quantity
            ELSE NULL::integer
        END) AS quantity_d24,
    sum(
        CASE
            WHEN (to_char((sei.deliver_ymd)::timestamp with time zone, 'dd'::text) = '25'::text) THEN sei.quantity
            ELSE NULL::integer
        END) AS quantity_d25,
    sum(
        CASE
            WHEN (to_char((sei.deliver_ymd)::timestamp with time zone, 'dd'::text) = '26'::text) THEN sei.quantity
            ELSE NULL::integer
        END) AS quantity_d26,
    sum(
        CASE
            WHEN (to_char((sei.deliver_ymd)::timestamp with time zone, 'dd'::text) = '27'::text) THEN sei.quantity
            ELSE NULL::integer
        END) AS quantity_d27,
    sum(
        CASE
            WHEN (to_char((sei.deliver_ymd)::timestamp with time zone, 'dd'::text) = '28'::text) THEN sei.quantity
            ELSE NULL::integer
        END) AS quantity_d28,
    sum(
        CASE
            WHEN (to_char((sei.deliver_ymd)::timestamp with time zone, 'dd'::text) = '29'::text) THEN sei.quantity
            ELSE NULL::integer
        END) AS quantity_d29,
    sum(
        CASE
            WHEN (to_char((sei.deliver_ymd)::timestamp with time zone, 'dd'::text) = '30'::text) THEN sei.quantity
            ELSE NULL::integer
        END) AS quantity_d30,
    sum(
        CASE
            WHEN (to_char((sei.deliver_ymd)::timestamp with time zone, 'dd'::text) = '31'::text) THEN sei.quantity
            ELSE NULL::integer
        END) AS quantity_d31,
    item.name1 AS item_name1_end,
    sei.tenant_id
   FROM seikyu sei,
    item
  WHERE (sei.item_id = item.id and sei.tenant_id = item.tenant_id)
  GROUP BY sei.customer_id, sei.item_id, sei.price, sei.price_sub, item.name1, (to_char((sei.deliver_ymd)::timestamp with time zone, 'yyyy'::text)), (to_char((sei.deliver_ymd)::timestamp with time zone, 'mm'::text)), sei.tenant_id;

--
-- Name: v_seikyu_b; Type: VIEW; Schema: public; Owner: lgnucurqlirpyu
--
drop view v_seikyu_b cascade;
CREATE VIEW v_seikyu_b AS
 SELECT to_char((seikyu.deliver_ymd)::timestamp with time zone, 'yyyy'::text) AS nen,
    to_char((seikyu.deliver_ymd)::timestamp with time zone, 'mm'::text) AS tuki,
    customer.group_id,
    customer.list,
    customer.id AS customer_id,
    customer.name1,
    customer.biko2 AS zei_kb,
        CASE
            WHEN ((customer.biko2)::text = '2'::text) THEN sum((seikyu.price * seikyu.quantity))
            ELSE trunc(sum(seikyu.price * seikyu.quantity) * 1.08) ::bigint
        END AS getugaku,
        CASE
            WHEN ((customer.biko2)::text = '2'::text) THEN 0
            ELSE trunc(sum(seikyu.price * seikyu.quantity) * 0.08) ::bigint
        END AS zeigaku,
    to_char(max(seikyu.ymdt), 'yyyy/mm/dd HH24:MI:SS'::text) AS max_ymdt,
    seikyu.tenant_id
   FROM (seikyu
     LEFT JOIN customer ON ((customer.id = seikyu.customer_id and customer.tenant_id = seikyu.tenant_id)))
  WHERE (customer.list IS NOT NULL)
  GROUP BY (to_char((seikyu.deliver_ymd)::timestamp with time zone, 'yyyy'::text)), (to_char((seikyu.deliver_ymd)::timestamp with time zone, 'mm'::text)), customer.id, customer.name1, customer.name2, customer.list, customer.group_id, customer.harai_kb, customer.biko2, seikyu.tenant_id
  ORDER BY (to_char((seikyu.deliver_ymd)::timestamp with time zone, 'yyyy'::text)), (to_char((seikyu.deliver_ymd)::timestamp with time zone, 'mm'::text)), customer.list, customer.id;

--
-- Name: v_seikyu_c; Type: VIEW; Schema: public; Owner: lgnucurqlirpyu
--

CREATE VIEW v_seikyu_c AS
 SELECT (((a.nen || '.'::text) || a.tuki) || ''::text) AS nengetu,
    sum(a.getugaku) AS getugaku,
    sum(a.zeigaku) AS zeigaku,
    max(a.max_ymdt) AS max_ymdt,
    sum(a.ninzu) AS ninzu,
    tenant_id
   FROM ( SELECT v_seikyu_b.nen,
            v_seikyu_b.tuki,
            sum(v_seikyu_b.getugaku) AS getugaku,
            sum(v_seikyu_b.zeigaku) AS zeigaku,
            max(v_seikyu_b.max_ymdt) AS max_ymdt,
            count(1) AS ninzu,
            v_seikyu_b.tenant_id
           FROM v_seikyu_b
          GROUP BY v_seikyu_b.nen, v_seikyu_b.tuki, v_seikyu_b.tenant_id
        UNION ALL
         SELECT to_char((date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone) + '00:00:00'::interval), 'yyyy'::text) AS nen,
            to_char((date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone) + '00:00:00'::interval), 'mm'::text) AS tuki,
            0,
            0,
            NULL::text,
            0,
            tenant_id
        from (select distinct tenant_id from mst_setting) x
        UNION ALL
         SELECT to_char((date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone) + '1 mon'::interval), 'yyyy'::text) AS nen,
            to_char((date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone) + '1 mon'::interval), 'mm'::text) AS tuki,
            0,
            0,
            NULL::text,
            0,
            tenant_id
        from (select distinct tenant_id from mst_setting) y
        UNION ALL
         SELECT to_char((date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone) + '2 mons'::interval), 'yyyy'::text) AS nen,
            to_char((date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone) + '2 mons'::interval), 'mm'::text) AS tuki,
            0,
            0,
            NULL::text,
            0,
            tenant_id
        from (select distinct tenant_id from mst_setting) z) a
  GROUP BY a.nen, a.tuki,a.tenant_id
  ORDER BY a.nen, a.tuki;



CREATE VIEW v_item_group AS
select
    min(id) min_id,
    'すべて' name1,
    count(1) kensu,
    min(tanka) min_tanka,
    max(tanka) max_tanka,
    tenant_id
from
    item
where
    del_flg = 0
group by
    tenant_id
union all
select
    min(id) min_id,
    name1,
    count(1) kensu,
    min(tanka) min_tanka,
    max(tanka) max_tanka,
    tenant_id
from
    item
where
    del_flg = 0
group by
    name1,
    tenant_id
;



--
-- Name: customer id; Type: DEFAULT; Schema: public; Owner: lgnucurqlirpyu
--

ALTER TABLE ONLY customer ALTER COLUMN id SET DEFAULT nextval('customer_id_seq'::regclass);


--
-- Name: item id; Type: DEFAULT; Schema: public; Owner: lgnucurqlirpyu
--

ALTER TABLE ONLY item ALTER COLUMN id SET DEFAULT nextval('item_id_seq'::regclass);


--
-- Name: customer customer_pkey; Type: CONSTRAINT; Schema: public; Owner: lgnucurqlirpyu
--

ALTER TABLE ONLY customer
    ADD CONSTRAINT customer_pkey PRIMARY KEY (id, tenant_id);


--
-- Name: daicho daicho_pkey; Type: CONSTRAINT; Schema: public; Owner: lgnucurqlirpyu
--

ALTER TABLE ONLY daicho
    ADD CONSTRAINT daicho_pkey PRIMARY KEY (customer_id, item_id, youbi, tenant_id);


--
-- Name: item item_pkey; Type: CONSTRAINT; Schema: public; Owner: lgnucurqlirpyu
--

ALTER TABLE ONLY item
    ADD CONSTRAINT item_pkey PRIMARY KEY (id, tenant_id);


--
-- Name: mst_setting mst_setting_pkey; Type: CONSTRAINT; Schema: public; Owner: lgnucurqlirpyu
--

ALTER TABLE ONLY mst_setting
    ADD CONSTRAINT mst_setting_pkey PRIMARY KEY (param_id, param_no, tenant_id);


--
-- Name: customer_id_idx; Type: INDEX; Schema: public; Owner: lgnucurqlirpyu
--

CREATE INDEX customer_id_idx ON customer USING btree (id);


--
-- Name: customer_id_idx1; Type: INDEX; Schema: public; Owner: lgnucurqlirpyu
--

CREATE INDEX customer_id_idx1 ON customer USING btree (id);


--
-- Name: daicho_customer_id_idx; Type: INDEX; Schema: public; Owner: lgnucurqlirpyu
--

CREATE INDEX daicho_customer_id_idx ON daicho USING btree (customer_id);


--
-- Name: daicho_item_id_idx; Type: INDEX; Schema: public; Owner: lgnucurqlirpyu
--

CREATE INDEX daicho_item_id_idx ON daicho USING btree (item_id);


--
-- Name: daicho_item_id_idx1; Type: INDEX; Schema: public; Owner: lgnucurqlirpyu
--

CREATE INDEX daicho_item_id_idx1 ON daicho USING btree (item_id);


--
-- Name: item_id_idx; Type: INDEX; Schema: public; Owner: lgnucurqlirpyu
--

CREATE INDEX item_id_idx ON item USING btree (id);


--
-- Name: item_id_idx1; Type: INDEX; Schema: public; Owner: lgnucurqlirpyu
--

CREATE INDEX item_id_idx1 ON item USING btree (id);


--
-- Name: LANGUAGE plpgsql; Type: ACL; Schema: -; Owner: postgres
--

--GRANT ALL ON LANGUAGE plpgsql TO lgnucurqlirpyu;


--
-- PostgreSQL database dump complete
--


insert into mst_setting values('START_YM','利用開始年月',1,'201908',null,null,'demo');
insert into mst_setting values('GROUP_KB','グループ区分',100,'月水金','Aグループ',null,'demo');
insert into mst_setting values('GROUP_KB','グループ区分',200,'火木土','Bグループ',null,'demo');
insert into mst_setting values('SIHARAI_KB','支払方法区分',1,'現金',null,null,'demo');
insert into mst_setting values('SIHARAI_KB','支払方法区分',2,'引落',null,null,'demo');
insert into mst_setting values('CUSTOMER_ZEI_KB','内税外税区分',1,'外税',null,null,'demo');
insert into mst_setting values('CUSTOMER_ZEI_KB','内税外税区分',2,'内税',null,null,'demo');


insert into mst_setting values('TENPO_SEIKYUSHO','請求書の店舗情報',1,'あああああ',null,null,'demo');
insert into mst_setting values('TENPO_SEIKYUSHO','請求書の店舗情報',2,'あああああ',null,null,'demo');
insert into mst_setting values('TENPO_SEIKYUSHO','請求書の店舗情報',3,'あああああ',null,null,'demo');

insert into mst_setting values('TENPO_RYOSYUSHO','領収書の店舗情報',1,'あああああ',null,null,'demo');
insert into mst_setting values('TENPO_RYOSYUSHO','領収書の店舗情報',2,'あああああ',null,null,'demo');
insert into mst_setting values('TENPO_RYOSYUSHO','領収書の店舗情報',3,'あああああ',null,null,'demo');



insert into mst_setting values('START_YM','利用開始年月',1,'201908',null,null,'hara');
insert into mst_setting values('GROUP_KB','グループ区分',100,'月水金','Aグループ',null,'hara');
insert into mst_setting values('GROUP_KB','グループ区分',200,'火木土','Bグループ',null,'hara');
insert into mst_setting values('GROUP_KB','グループ区分',300,'月水金[佐藤]','Cグループ',null,'hara');
insert into mst_setting values('SIHARAI_KB','支払方法区分',1,'現金',null,null,'hara');
insert into mst_setting values('SIHARAI_KB','支払方法区分',2,'引落',null,null,'hara');
insert into mst_setting values('CUSTOMER_ZEI_KB','内税外税区分',1,'外税',null,null,'hara');
insert into mst_setting values('CUSTOMER_ZEI_KB','内税外税区分',2,'内税',null,null,'hara');


insert into mst_setting values('TENPO_SEIKYUSHO','請求書の店舗情報',1,'あああああ',null,null,'hara');
insert into mst_setting values('TENPO_SEIKYUSHO','請求書の店舗情報',2,'あああああ',null,null,'hara');
insert into mst_setting values('TENPO_SEIKYUSHO','請求書の店舗情報',3,'あああああ',null,null,'hara');

insert into mst_setting values('TENPO_RYOSYUSHO','領収書の店舗情報',1,'あああああ',null,null,'hara');
insert into mst_setting values('TENPO_RYOSYUSHO','領収書の店舗情報',2,'あああああ',null,null,'hara');
insert into mst_setting values('TENPO_RYOSYUSHO','領収書の店舗情報',3,'あああああ',null,null,'hara');


delete from mst_setting where param_id = 'CSV_FILE_NAME';
insert into mst_setting values('CSV_FILE_NAME','CSV出力ファイル名',1,'売上集計表_担当別'     ,'v_csv_uriage_tantobetu'    ,null,'demo');
insert into mst_setting values('CSV_FILE_NAME','CSV出力ファイル名',2,'売上集計表_グループ別' ,'v_csv_uriage_groupbetu'    ,null,'demo');
insert into mst_setting values('CSV_FILE_NAME','CSV出力ファイル名',3,'売上集計表_顧客別'     ,'v_csv_uriage_kokyakubetu'  ,null,'demo');
insert into mst_setting values('CSV_FILE_NAME','CSV出力ファイル名',4,'引落データ集計'        ,'v_csv_hikiotosi'           ,null,'demo');
insert into mst_setting values('CSV_FILE_NAME','CSV出力ファイル名',5,'宅配パターン台帳'      ,'v_csv_takuhai'             ,null,'demo');


insert into mst_setting values('CSV_FILE_NAME','CSV出力ファイル名',1,'売上集計表_担当別'     ,'v_csv_uriage_tantobetu'    ,null,'hara');
insert into mst_setting values('CSV_FILE_NAME','CSV出力ファイル名',2,'売上集計表_グループ別' ,'v_csv_uriage_groupbetu'    ,null,'hara');
insert into mst_setting values('CSV_FILE_NAME','CSV出力ファイル名',3,'売上集計表_顧客別'     ,'v_csv_uriage_kokyakubetu'  ,null,'hara');
insert into mst_setting values('CSV_FILE_NAME','CSV出力ファイル名',4,'引落データ集計'        ,'v_csv_hikiotosi'           ,null,'hara');
insert into mst_setting values('CSV_FILE_NAME','CSV出力ファイル名',5,'宅配パターン台帳'      ,'v_csv_takuhai'             ,null,'hara');


delete from mst_setting where param_id = 'VIEW_COLUMN_NAME';

insert into mst_setting values('VIEW_COLUMN_NAME','ビューカラム名',1,  'v_csv_uriage_tantobetu'    ,'年,月,担当,顧客ID,顧客名,商品ID,商品コード,商品名,本数_a,単価_b,計_a×b,卸値_c, 計_a×c,グループID,担当ID',null,'demo');
insert into mst_setting values('VIEW_COLUMN_NAME','ビューカラム名',2,  'v_csv_uriage_groupbetu'    ,'年,月,グループID,グループ名,担当ID,売上合計,件数',null,'demo');
insert into mst_setting values('VIEW_COLUMN_NAME','ビューカラム名',3,  'v_csv_uriage_kokyakubetu'  ,'年,月,グループID,グループ名,顧客ID,顧客名,請求額,担当ID',null,'demo');
insert into mst_setting values('VIEW_COLUMN_NAME','ビューカラム名',4,  'v_csv_hikiotosi'           ,'年,月,宅配順,氏名１,氏名２,支払方法区分,支払方法区分名,請求額,税込額,税区分,グループID,担当ID',null,'demo');
insert into mst_setting values('VIEW_COLUMN_NAME','ビューカラム名',5,  'v_csv_takuhai'             ,'グループID,宅配順,顧客ID,担当者,顧客名１,顧客名２,住所１,住所２,住所３,支払方法区分,削除フラグ,商品ID,商品コード,商品名１,商品名２,単価,削除フラグ,月,火,水,木,金,土,日,計,担当ID',null,'demo');

insert into mst_setting values('VIEW_COLUMN_NAME','ビューカラム名',1,  'v_csv_uriage_tantobetu'    ,'年,月,担当,顧客ID,顧客名,商品ID,商品コード,商品名,本数_a,単価_b,計_a×b,卸値_c, 計_a×c,グループID,担当ID',null,'hara');
insert into mst_setting values('VIEW_COLUMN_NAME','ビューカラム名',2,  'v_csv_uriage_groupbetu'    ,'年,月,グループID,グループ名,担当ID,売上合計,件数',null,'hara');
insert into mst_setting values('VIEW_COLUMN_NAME','ビューカラム名',3,  'v_csv_uriage_kokyakubetu'  ,'年,月,グループID,グループ名,顧客ID,顧客名,請求額,担当ID',null,'hara');
insert into mst_setting values('VIEW_COLUMN_NAME','ビューカラム名',4,  'v_csv_hikiotosi'           ,'年,月,宅配順,氏名１,氏名２,支払方法区分,支払方法区分名,請求額,税込額,税区分,グループID,担当ID',null,'hara');
insert into mst_setting values('VIEW_COLUMN_NAME','ビューカラム名',5,  'v_csv_takuhai'             ,'グループID,宅配順,顧客ID,担当者,顧客名１,顧客名２,住所１,住所２,住所３,支払方法区分,削除フラグ,商品ID,商品コード,商品名１,商品名２,単価,削除フラグ,月,火,水,木,金,土,日,計,担当ID',null,'hara');

--
--



drop view v_csv_uriage_tantobetu;
CREATE VIEW v_csv_uriage_tantobetu AS
SELECT
    to_char((seikyu.deliver_ymd)::timestamp with time zone, 'yyyy'::text) AS nen,
    to_char((seikyu.deliver_ymd)::timestamp with time zone, 'mm'::text)   AS tuki,
    ht_kb.param_val1 tenpo,
    customer.list customer_id,
    customer.name1 customer_name1,
    seikyu.item_id item_id,
    item.code item_code,
    item.name1 item_name1,
    Sum(
        seikyu.quantity
    ) honsu,
    item.tanka item_tanka,
    Sum(
        seikyu.price * seikyu.quantity
    ) kei,
    item.orosine item_orosine,
    Sum(
        item.orosine * seikyu.quantity
    ) orosikei,
    customer.group_id,
    customer.biko1 tanto_id,
    seikyu.tenant_id
FROM
    seikyu,
    customer,
    (
        SELECT
            *
        FROM
            mst_setting
        WHERE
            param_id = 'HONTEN_KB'
    ) ht_kb,
    item
WHERE
    seikyu.customer_id = customer.id
AND customer.list IS NOT NULL
AND customer.biko1 = ht_kb.param_no::text
AND seikyu.item_id = item.id
AND seikyu.tenant_id = customer.tenant_id
AND seikyu.tenant_id = item.tenant_id
AND seikyu.tenant_id = ht_kb.tenant_id
GROUP BY
    to_char((seikyu.deliver_ymd)::timestamp with time zone, 'yyyy'::text) ,
    to_char((seikyu.deliver_ymd)::timestamp with time zone, 'mm'::text)   ,
    ht_kb.param_val1 ,
    customer.list,
    customer.name1,
    seikyu.item_id,
    item.code,
    item.name1,
    item.tanka,
    item.orosine,
    seikyu.tenant_id,
    customer.group_id,
    customer.biko1
ORDER BY
    to_char((seikyu.deliver_ymd)::timestamp with time zone, 'yyyy'::text) desc,
    to_char((seikyu.deliver_ymd)::timestamp with time zone, 'mm'::text)   desc,
    ht_kb.param_val1,
    customer.list,
    item.code
;





drop view v_csv_uriage_groupbetu;
CREATE VIEW v_csv_uriage_groupbetu as
select
    nen,
    tuki,
    group_id,
    group_nm1,
    biko1 tanto_id,
    sum(
        shokei
    ) gokei,
    count(*) kensu,
    tenant_id
from
    (
        select
            to_char((seikyu.deliver_ymd)::timestamp with time zone, 'yyyy'::text) nen,
            to_char((seikyu.deliver_ymd)::timestamp with time zone, 'mm'::text)   tuki,
            mst_group.group_nm1,
            customer.id,
            trunc(sum(seikyu.price * seikyu.quantity) * 1.08) shokei,
            customer.group_id,
            customer.biko1,
            seikyu.tenant_id
        from
            seikyu,
            customer,
            (select tenant_id, param_no group_id, param_val1 group_nm1 from mst_setting where param_id = 'GROUP_KB') mst_group
        where
            seikyu.customer_id = customer.id
        and customer.group_id = mst_group.group_id
        and customer.list is not null
        and seikyu.tenant_id = customer.tenant_id 
        and mst_group.tenant_id = seikyu.tenant_id 
        group by
            nen,
            tuki,
            customer.group_id,
            mst_group.group_nm1,
            customer.id,
            customer.biko1,
            seikyu.tenant_id
        order by
            nen,
            tuki,
            customer.group_id,
            customer.id,
            customer.biko1
    ) a
group by
    nen,
    tuki,
    group_id,
    group_nm1,
    biko1,
    tenant_id
order by
    nen desc,
    tuki desc,
    group_id,
    biko1
;








drop view v_csv_uriage_kokyakubetu;
CREATE VIEW v_csv_uriage_kokyakubetu AS
SELECT
    to_char((seikyu.deliver_ymd)::timestamp with time zone, 'yyyy'::text) nen,
    to_char((seikyu.deliver_ymd)::timestamp with time zone, 'mm'::text)   tuki,
    customer.group_id,
    mst_group.group_nm1,
    customer.list customer_id,
    customer.name1 customer_name1,
    sum(
        seikyu.price * seikyu.quantity
    ) kei,
    customer.biko1 tanto_id,
    seikyu.tenant_id
FROM
    seikyu,
    customer,
    (select tenant_id, param_no group_id, param_val1 group_nm1 from mst_setting where param_id = 'GROUP_KB') mst_group
WHERE
    seikyu.customer_id = customer.id
AND customer.group_id = mst_group.group_id
AND customer.list IS NOT NULL
and seikyu.tenant_id = customer.tenant_id
and mst_group.tenant_id = seikyu.tenant_id
group by
    to_char((seikyu.deliver_ymd)::timestamp with time zone, 'yyyy'::text) ,
    to_char((seikyu.deliver_ymd)::timestamp with time zone, 'mm'::text)   ,
    customer.group_id,
    mst_group.group_nm1,
    customer.list,
    customer.name1,
    customer.biko1,
    seikyu.tenant_id
ORDER BY
    to_char((seikyu.deliver_ymd)::timestamp with time zone, 'yyyy'::text) desc,
    to_char((seikyu.deliver_ymd)::timestamp with time zone, 'mm'::text)   desc
;






drop view v_csv_hikiotosi;
CREATE VIEW v_csv_hikiotosi AS
SELECT
    to_char((seikyu.deliver_ymd)::timestamp with time zone, 'yyyy'::text) nen,
    to_char((seikyu.deliver_ymd)::timestamp with time zone, 'mm'::text)   tuki,
    customer.list,
    customer.name1,
    customer.name2,
    customer.harai_kb,
    kb.param_val1,
    SUM(
        seikyu.price * seikyu.quantity
    ) gokei,
    case
        when biko2 = '1' then trunc(
            SUM(seikyu.price * seikyu.quantity) * 1.08
        )
        when biko2 = '2' then SUM(
            seikyu.price * seikyu.quantity
        )
        else 0
    end zeikomi,
    case
        when biko2 = '1' then '外税'
        when biko2 = '2' then '内税'
        else 'エラー'
    end zei_kb,
    customer.group_id,
    customer.biko1 tanto_id,
    seikyu.tenant_id
FROM
    seikyu,
    customer,
    (
        SELECT
            *
        FROM
            mst_setting
        WHERE
            param_id = 'SIHARAI_KB'
    ) kb
WHERE
    seikyu.customer_id = customer.id
AND customer.harai_kb IN(
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        10
    )
AND customer.list IS NOT NULL
AND customer.harai_kb = kb.param_no
and seikyu.tenant_id = customer.tenant_id
and seikyu.tenant_id = kb.tenant_id
GROUP BY
    nen,
    tuki,
    harai_kb,
    list,
    customer_id,
    customer.name1,
    customer.name2,
    customer.harai_kb,
    kb.param_val1,
    biko2,
    customer.group_id,
    customer.biko1,
    seikyu.tenant_id
ORDER BY
    nen desc,
    tuki desc,
    harai_kb,
    customer.name2,
    list,
    customer_id
;






drop view v_csv_takuhai;
CREATE VIEW v_csv_takuhai AS
SELECT
    customer.group_id,
    customer.list,
    daicho.customer_id,
    p2.param_val1 tenpo,
    customer.name1 cname1,
    customer.name2 cname2,
    customer.address1,
    customer.address2,
    customer.address3,
    customer.harai_kb,
    customer.del_flg cdel_flg,
    daicho.item_id,
    item.code icode,
    item.name1 iname1,
    item.name2 iname2,
    item.tanka,
    item.del_flg idel_flg,
    Sum(
        CASE
            WHEN daicho.youbi = 1 THEN quantity
            ELSE 0
        end
    ) getu,
    Sum(
        CASE
            WHEN daicho.youbi = 2 THEN quantity
            ELSE 0
        end
    ) ka,
    Sum(
        CASE
            WHEN daicho.youbi = 3 THEN quantity
            ELSE 0
        end
    ) sui,
    Sum(
        CASE
            WHEN daicho.youbi = 4 THEN quantity
            ELSE 0
        end
    ) moku,
    Sum(
        CASE
            WHEN daicho.youbi = 5 THEN quantity
            ELSE 0
        end
    ) kin,
    Sum(
        CASE
            WHEN daicho.youbi = 6 THEN quantity
            ELSE 0
        end
    ) dou,
    Sum(
        CASE
            WHEN daicho.youbi = 7 THEN quantity
            ELSE 0
        end
    ) niti,
    Sum(
        quantity
    ) total,
    customer.biko1 tanto_id,
    daicho.tenant_id
FROM
    daicho
    left outer join
        customer
    on  daicho.customer_id = customer.id
    and daicho.tenant_id = customer.tenant_id
    left outer join
        item
    on  daicho.item_id = item.id
    and daicho.tenant_id = item.tenant_id
    left outer join
        (
            select
                tenant_id,
                param_no,
                param_val1
            from
                mst_setting
            where
                param_id = 'HONTEN_KB'
        ) p2
    on  customer.biko1 = p2.param_no::text
    and customer.tenant_id = p2.tenant_id
WHERE
    customer.list IS NOT NULL
AND customer.del_flg = 0
GROUP BY
    customer.group_id,
    customer.list,
    daicho.customer_id,
    p2.param_val1 ,
    customer.name1 ,
    customer.name2 ,
    customer.address1,
    customer.address2,
    customer.address3,
    customer.harai_kb,
    customer.del_flg,
    daicho.item_id,
    item.code ,
    item.name1 ,
    item.name2 ,
    item.tanka,
    item.del_flg,
    customer.biko1,
    daicho.tenant_id
ORDER BY
    customer.group_id,
    customer.list,
    item.code
;




--
--
--    param_id     |      param_nm      | param_no |                            param_val1                             |     param_val2     | param_val3
-------------------+--------------------+----------+-------------------------------------------------------------------+--------------------+------------
-- COMMENT_SEIKYU  | コメント（請求書） |        1 | ご希望の方には、口座引落しを/ご案内しております。ご相談ください。 |                    |
-- COMMENT_SEIKYU  | コメント（請求書） |        2 | 毎月月末締めの/翌月の１日引き落としになります。                   |                    |
-- COMMENT_SEIKYU  | コメント（請求書） |        3 | 毎月月末締めの/翌月の５日引き落としになります。                   |                    |
-- COMMENT_SEIKYU  | コメント（請求書） |        4 | 毎月月末締めの/翌月の５日引き落としになります。                   |                    |
-- COMMENT_SEIKYU  | コメント（請求書） |        5 | 毎月月末締めの/翌月の５日引き落としになります。                   |                    |
-- COMMENT_SEIKYU  | コメント（請求書） |        6 | ご希望の方には、口座引落しを/ご案内しております。ご相談ください。 |                    |
-- COMMENT_SEIKYU  | コメント（請求書） |        7 | 毎月月末締めの/翌月の５日引き落としになります。                   |                    |
-- COMMENT_SEIKYU  | コメント（請求書） |        8 | 毎月月末締めの/翌月の５日引き落としになります。                   |                    |
-- COMMENT_SEIKYU  | コメント（請求書） |        9 | ［振込先］/第四銀行白根支店（普）1415237                          |                    |
-- COMMENT_SEIKYU  | コメント（請求書） |       10 | 毎月月末締めの/翌月の５日引き落としになります。                   |                    |
-- CUSTOMER_ZEI_KB | 内税外税区分       |        1 | 外税                                                              |                    |
-- CUSTOMER_ZEI_KB | 内税外税区分       |        2 | 内税                                                              |                    |
-- GROUP_KB        | グループ区分       |      100 | 月水金                                                            | Aグループ          |
-- GROUP_KB        | グループ区分       |      200 | 火木土                                                            | Bグループ          |
-- GROUP_KB        | グループ区分       |      300 | テスト                                                            | Cグループ          |
-- HONTEN_KB       | 本店区分           |        1 | 1:HONTEN                                                          |                    |
-- HONTEN_KB       | 本店区分           |        2 | 2:HIROKAWA                                                        |                    |
-- HONTEN_KB       | 本店区分           |        3 | 3:SATO                                                            |                    |
-- HONTEN_KB       | 本店区分           |        4 | 4:TANABE                                                          |                    |
-- SIHARAI_KB      | 支払方法区分       |        1 | 現金                                                              |                    |
-- SIHARAI_KB      | 支払方法区分       |        2 | 引落（ＪＡ）                                                      |                    |
-- SIHARAI_KB      | 支払方法区分       |        3 | 引落（第四）                                                      |                    |
-- SIHARAI_KB      | 支払方法区分       |        4 | 引落（巻信）                                                      |                    |
-- SIHARAI_KB      | 支払方法区分       |        5 | 引落（協栄）                                                      |                    |
-- SIHARAI_KB      | 支払方法区分       |        6 | 受け箱集金                                                        |                    |
-- SIHARAI_KB      | 支払方法区分       |        7 | 引落（三信）                                                      |                    |
-- SIHARAI_KB      | 支払方法区分       |        8 | 引落（ゆうちょ）                                                  |                    |
-- SIHARAI_KB      | 支払方法区分       |        9 | 口座振込                                                          |                    |
-- SIHARAI_KB      | 支払方法区分       |       10 | 引落（北越）                                                      |                    |
-- START_YM        | 利用開始年月       |        1 | 201908                                                            |                    |
-- ZEI_KB          | 税区分             |        1 | 10                                                                | 10%                |
-- ZEI_KB          | 税区分             |        2 | 8                                                                 | 8%（軽減税率対象） |
--(32 行)






-- ALTER TABLE customer DROP COLUMN tenant_id;

ALTER TABLE customer     ADD COLUMN tenant_id character varying(80) not null default 'demo';
ALTER TABLE item         ADD COLUMN tenant_id character varying(80) not null default 'demo';
ALTER TABLE daicho       ADD COLUMN tenant_id character varying(80) not null default 'demo';
ALTER TABLE seikyu       ADD COLUMN tenant_id character varying(80) not null default 'demo';
ALTER TABLE mst_setting  ADD COLUMN tenant_id character varying(80) not null default 'demo';







/*
|| 備考１が"3"のデータについて、group_idを300へ更新
|| テナントID:haraのみ
*/
create table customer_bk20210218 as select * from customer;
begin;
update customer set group_id = 300 where biko1 = '3' and tenant_id = 'hara' and list is not null;
rollback;





--
--/*
--|| 曜日変換ファンクション
--*/
--DROP FUNCTION IF EXISTS date_to_youbi(date);
--
--CREATE OR REPLACE FUNCTION date_to_youbi(ymd date)
--RETURNS INTEGER AS $$
--  begin
--    IF to_char(ymd,'D') = '1' THEN 
--        return 7;
--    ELSE
--        return to_char(ymd,'D')::INTEGER - 1;
--    END IF;
--  end;
--$$ LANGUAGE plpgsql;
--
--select deliver_ymd, date_to_youbi(deliver_ymd) from seikyu;
