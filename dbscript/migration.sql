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
    biko3 character varying(40)
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
    quantity integer
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
    orosine integer,
    zei_kb integer,
    del_flg integer
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
    param_val3 character varying(200)
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
    ymdt timestamp without time zone NOT NULL
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
    sum(daicho.quantity) AS total
   FROM ((daicho
     LEFT JOIN customer ON ((daicho.customer_id = customer.id)))
     LEFT JOIN item ON ((daicho.item_id = item.id)))
  WHERE ((customer.list IS NOT NULL) AND (customer.del_flg = 0))
  GROUP BY customer.group_id, customer.list, daicho.customer_id, customer.name1, customer.name2, customer.address1, customer.address2, customer.address3, customer.harai_kb, customer.del_flg, daicho.item_id, item.code, item.name1, item.name2, item.tanka, item.del_flg
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
    item.name1 AS item_name1_end
   FROM seikyu sei,
    item
  WHERE (sei.item_id = item.id)
  GROUP BY sei.customer_id, sei.item_id, sei.price, sei.price_sub, item.name1, (to_char((sei.deliver_ymd)::timestamp with time zone, 'yyyy'::text)), (to_char((sei.deliver_ymd)::timestamp with time zone, 'mm'::text));

--
-- Name: v_seikyu_b; Type: VIEW; Schema: public; Owner: lgnucurqlirpyu
--

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
            ELSE ((((sum((seikyu.price * seikyu.quantity)))::numeric * 1.08))::integer)::bigint
        END AS getugaku,
        CASE
            WHEN ((customer.biko2)::text = '2'::text) THEN 0
            ELSE (((sum((seikyu.price * seikyu.quantity)))::numeric * 0.08))::integer
        END AS zeigaku,
    to_char(max(seikyu.ymdt), 'yyyy/mm/dd HH24:MI:SS'::text) AS max_ymdt
   FROM (seikyu
     LEFT JOIN customer ON ((customer.id = seikyu.customer_id)))
  WHERE (customer.list IS NOT NULL)
  GROUP BY (to_char((seikyu.deliver_ymd)::timestamp with time zone, 'yyyy'::text)), (to_char((seikyu.deliver_ymd)::timestamp with time zone, 'mm'::text)), customer.id, customer.name1, customer.name2, customer.list, customer.group_id, customer.harai_kb, customer.biko2
  ORDER BY (to_char((seikyu.deliver_ymd)::timestamp with time zone, 'yyyy'::text)), (to_char((seikyu.deliver_ymd)::timestamp with time zone, 'mm'::text)), customer.list, customer.id;

--
-- Name: v_seikyu_c; Type: VIEW; Schema: public; Owner: lgnucurqlirpyu
--

CREATE VIEW v_seikyu_c AS
 SELECT (((a.nen || '.'::text) || a.tuki) || ''::text) AS nengetu,
    sum(a.getugaku) AS getugaku,
    sum(a.zeigaku) AS zeigaku,
    max(a.max_ymdt) AS max_ymdt,
    sum(a.ninzu) AS ninzu
   FROM ( SELECT v_seikyu_b.nen,
            v_seikyu_b.tuki,
            sum(v_seikyu_b.getugaku) AS getugaku,
            sum(v_seikyu_b.zeigaku) AS zeigaku,
            max(v_seikyu_b.max_ymdt) AS max_ymdt,
            count(1) AS ninzu
           FROM v_seikyu_b
          GROUP BY v_seikyu_b.nen, v_seikyu_b.tuki
        UNION ALL
         SELECT to_char((date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone) + '00:00:00'::interval), 'yyyy'::text) AS nen,
            to_char((date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone) + '00:00:00'::interval), 'mm'::text) AS tuki,
            0,
            0,
            NULL::text,
            0
        UNION ALL
         SELECT to_char((date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone) + '1 mon'::interval), 'yyyy'::text) AS nen,
            to_char((date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone) + '1 mon'::interval), 'mm'::text) AS tuki,
            0,
            0,
            NULL::text,
            0
        UNION ALL
         SELECT to_char((date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone) + '2 mons'::interval), 'yyyy'::text) AS nen,
            to_char((date_trunc('month'::text, (CURRENT_DATE)::timestamp with time zone) + '2 mons'::interval), 'mm'::text) AS tuki,
            0,
            0,
            NULL::text,
            0) a
  GROUP BY a.nen, a.tuki
  ORDER BY a.nen, a.tuki;

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
    ADD CONSTRAINT customer_pkey PRIMARY KEY (id);


--
-- Name: daicho daicho_pkey; Type: CONSTRAINT; Schema: public; Owner: lgnucurqlirpyu
--

ALTER TABLE ONLY daicho
    ADD CONSTRAINT daicho_pkey PRIMARY KEY (customer_id, item_id, youbi);


--
-- Name: item item_pkey; Type: CONSTRAINT; Schema: public; Owner: lgnucurqlirpyu
--

ALTER TABLE ONLY item
    ADD CONSTRAINT item_pkey PRIMARY KEY (id);


--
-- Name: mst_setting mst_setting_pkey; Type: CONSTRAINT; Schema: public; Owner: lgnucurqlirpyu
--

ALTER TABLE ONLY mst_setting
    ADD CONSTRAINT mst_setting_pkey PRIMARY KEY (param_id, param_no);


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


insert into mst_setting values('START_YM','利用開始年月',1,'201908',null,null);
insert into mst_setting values('GROUP_KB','グループ区分',100,'月水金','Aグループ',null);
insert into mst_setting values('GROUP_KB','グループ区分',200,'火木土','Aグループ',null);
insert into mst_setting values('SIHARAI_KB','支払方法区分',1,'現金',null,null);
insert into mst_setting values('SIHARAI_KB','支払方法区分',2,'引落',null,null);
insert into mst_setting values('CUSTOMER_ZEI_KB','内税外税区分',1,'外税',null,null);
insert into mst_setting values('CUSTOMER_ZEI_KB','内税外税区分',2,'内税',null,null);

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
