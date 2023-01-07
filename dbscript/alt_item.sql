alter table item drop column orderable ;
alter table item drop column order_deny ;
alter table item add column orderable integer;
alter table item alter column orderable set default 1;

