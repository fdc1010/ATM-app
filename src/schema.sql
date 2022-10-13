-- ---
-- Table "pins"
-- ---

DROP TABLE IF EXISTS pins;

create table pins(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          pin varchar(4), 
          amount varchar(10)
        );

-- ---
-- Default Data
-- ---

insert into pins (pin, amount) values ("1111", "80000");
insert into pins (pin, amount) values ("2222", "85000");
insert into pins (pin, amount) values ("3333", "87500");
insert into pins (pin, amount) values ("4444", "90000");
