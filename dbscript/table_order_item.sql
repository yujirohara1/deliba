drop table order_item;

CREATE TABLE order_item (
    id integer NOT NULL,
    order_ymd date NOT NULL,
    hope_ymd date NOT NULL,
    item_id integer NOT NULL,
    item_code character varying(20) NOT NULL,
    item_name1 character varying(80) NOT NULL,
    item_siire numeric(10,3) not null,
    quantity integer not null,
    send_stamp timestamp  not null,
    receive_stamp timestamp ,
    tenant_id character varying(80) not null
);

--
-- Name: item_id_seq; Type: SEQUENCE; Schema: public; Owner: lgnucurqlirpyu
--

CREATE SEQUENCE order_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE ONLY order_item ALTER COLUMN id SET DEFAULT nextval('order_item_id_seq'::regclass);


ALTER TABLE ONLY order_item ADD CONSTRAINT order_item_pkey PRIMARY KEY (send_stamp, item_id, tenant_id);

