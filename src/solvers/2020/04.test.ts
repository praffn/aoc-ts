import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./04";

test("2020.04", async (t) => {
  const input = `byr:2010 pid:#1bb4d8 eyr:2021 hgt:186cm iyr:2020 ecl:grt

pid:937877382 eyr:2029
ecl:amb hgt:187cm iyr:2019
byr:1933 hcl:#888785

ecl:hzl
eyr:2020
hcl:#18171d
iyr:2019 hgt:183cm
byr:1935

hcl:#7d3b0c hgt:183cm cid:135
byr:1992 eyr:2024 iyr:2013 pid:138000309
ecl:oth

ecl:hzl
hgt:176cm pid:346059944 byr:1929 cid:150 eyr:1924 hcl:#fffffd iyr:2016

iyr:2011
cid:99 ecl:amb
eyr:2030 hcl:#18171d
hgt:165cm pid:897123249 byr:1948

hcl:#cfa07d pid:827609097 ecl:gry iyr:2017 byr:1963
eyr:2029 hgt:72in

hcl:#6b5442 eyr:2028 iyr:2016 ecl:hzl
hgt:152cm
pid:432183209 byr:1984

hgt:169cm hcl:#888785 ecl:hzl pid:626107466 byr:1929 iyr:2013 cid:217
eyr:2026

hcl:#bdb95d byr:1935 eyr:2023 ecl:blu iyr:2011 cid:90 hgt:64cm
pid:155167914

iyr:2017
byr:1943 cid:56
hcl:#888785 hgt:193cm pid:621305634
ecl:amb
eyr:2024

ecl:gry
hcl:#a97842 pid:936999610 cid:169 byr:1991 eyr:2029 hgt:175cm iyr:2017

hcl:#866857 ecl:gry
byr:1975 hgt:71in
pid:180628540 eyr:2020
iyr:2017

hcl:#cfa07d hgt:153cm byr:1962 cid:325
iyr:2018 eyr:2020
ecl:amb pid:579364506

hcl:#6b5442 iyr:2010 ecl:amb byr:2001
eyr:2020 pid:406219444
hgt:173cm

pid:#430c70
ecl:gry iyr:2018 hcl:#866857 eyr:2021 cid:97 byr:1997
hgt:75cm

iyr:2023 pid:#518780
eyr:2034
ecl:zzz
hgt:72cm
hcl:z byr:2010

pid:1961614335 hcl:#c0946f hgt:157 ecl:grn eyr:2031 byr:1972 iyr:1992

cid:142
eyr:2022 ecl:amb
hgt:68in
hcl:#6b5442 byr:1927 pid:112372155 iyr:2012

byr:1972
hgt:169cm
hcl:#888785
cid:75 iyr:2015 eyr:2021 ecl:oth
pid:7889059161

ecl:brn
iyr:2020
eyr:2026 hgt:151cm byr:1961 pid:468038868 hcl:#18171d`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 19);
  t.assert.equal(result.second, 13);
});
