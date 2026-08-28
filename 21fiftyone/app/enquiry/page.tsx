"use client";

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* ------------------------------------------------------------------ */
/* Country dial codes                                                  */
/* ------------------------------------------------------------------ */

interface Country {
  iso: string;
  fl: string;
  ds: string;
  dial: string;
}

const countries: Country[] = [
  { iso: "af", fl: "&#127462&#127467;", ds: "Afghanistan", dial: "+93" },
  { iso: "al", fl: "&#127462&#127473;", ds: "Albania", dial: "+355" },
  { iso: "dz", fl: "&#127465&#127487;", ds: "Algeria", dial: "+213" },
  { iso: "as", fl: "&#127462&#127480;", ds: "American Samoa", dial: "+1684" },
  { iso: "ad", fl: "&#127462&#127465;", ds: "Andorra", dial: "+376" },
  { iso: "ao", fl: "&#127462&#127476;", ds: "Angola", dial: "+244" },
  { iso: "ai", fl: "&#127462&#127470;", ds: "Anguilla", dial: "+1264" },
  { iso: "aq", fl: "&#127462&#127478;", ds: "Antarctica", dial: "+672" },
  { iso: "ag", fl: "&#127462&#127468;", ds: "Antigua & Barbuda", dial: "+1268" },
  { iso: "ar", fl: "&#127462&#127479;", ds: "Argentina", dial: "+54" },
  { iso: "am", fl: "&#127462&#127474;", ds: "Armenia", dial: "+374" },
  { iso: "aw", fl: "&#127462&#127484;", ds: "Aruba", dial: "+297" },
  { iso: "au", fl: "&#127462&#127482;", ds: "Australia", dial: "+61" },
  { iso: "at", fl: "&#127462&#127481;", ds: "Austria", dial: "+43" },
  { iso: "az", fl: "&#127462&#127487;", ds: "Azerbaijan", dial: "+994" },
  { iso: "bs", fl: "&#127463&#127480;", ds: "Bahamas", dial: "+1242" },
  { iso: "bh", fl: "&#127463&#127469;", ds: "Bahrain", dial: "+973" },
  { iso: "bd", fl: "&#127463&#127465;", ds: "Bangladesh", dial: "+880" },
  { iso: "bb", fl: "&#127463&#127463;", ds: "Barbados", dial: "+1246" },
  { iso: "by", fl: "&#127463&#127486;", ds: "Belarus", dial: "+375" },
  { iso: "be", fl: "&#127463&#127466;", ds: "Belgium", dial: "+32" },
  { iso: "bz", fl: "&#127463&#127487;", ds: "Belize", dial: "+501" },
  { iso: "bj", fl: "&#127463&#127471;", ds: "Benin", dial: "+229" },
  { iso: "bm", fl: "&#127463&#127474;", ds: "Bermuda", dial: "+1441" },
  { iso: "bt", fl: "&#127463&#127481;", ds: "Bhutan", dial: "+975" },
  { iso: "bo", fl: "&#127463&#127476;", ds: "Bolivia", dial: "+591" },
  { iso: "ba", fl: "&#127463&#127462;", ds: "Bosnia and Herzegovina", dial: "+387" },
  { iso: "bw", fl: "&#127463&#127484;", ds: "Botswana", dial: "+267" },
  { iso: "bv", fl: "&#127463&#127483;", ds: "Bouvet Island", dial: "+47" },
  { iso: "br", fl: "&#127463&#127479;", ds: "Brazil", dial: "+55" },
  { iso: "io", fl: "&#127470&#127476;", ds: "British Indian Ocean Territory", dial: "+246" },
  { iso: "vg", fl: "&#127483&#127468;", ds: "British Virgin Islands", dial: "+1284" },
  { iso: "bn", fl: "&#127463&#127475;", ds: "Brunei", dial: "+673" },
  { iso: "bg", fl: "&#127463&#127468;", ds: "Bulgaria", dial: "+359" },
  { iso: "bf", fl: "&#127463&#127467;", ds: "Burkina Faso", dial: "+226" },
  { iso: "bi", fl: "&#127463&#127470;", ds: "Burundi", dial: "+257" },
  { iso: "kh", fl: "&#127472&#127469;", ds: "Cambodia", dial: "+855" },
  { iso: "cm", fl: "&#127464&#127474;", ds: "Cameroon", dial: "+237" },
  { iso: "ca", fl: "&#127464&#127462;", ds: "Canada", dial: "+1" },
  { iso: "", fl: "&#127464&#127483;", ds: "Cape Verde", dial: "+238" },
  { iso: "cv", fl: "&#127463&#127478;", ds: "Caribbean Netherlands", dial: "+599" },
  { iso: "ky", fl: "&#127472&#127486;", ds: "Cayman Islands", dial: "+1345" },
  { iso: "cf", fl: "&#127464&#127467;", ds: "Central African Republic", dial: "+236" },
  { iso: "td", fl: "&#127481&#127465;", ds: "Chad", dial: "+235" },
  { iso: "cl", fl: "&#127464&#127473;", ds: "Chile", dial: "+56" },
  { iso: "cn", fl: "&#127464&#127475;", ds: "China", dial: "+86" },
  { iso: "cx", fl: "&#127464&#127485;", ds: "Christmas Island", dial: "+61" },
  { iso: "cc", fl: "&#127464&#127464;", ds: "Cocos (Keeling) Island", dial: "+61" },
  { iso: "co", fl: "&#127464&#127476;", ds: "Colombia", dial: "+57" },
  { iso: "km", fl: "&#127472&#127474;", ds: "Comoros", dial: "+269" },
  { iso: "cg", fl: "&#127464&#127468;", ds: "Congo - Brazzaville", dial: "+242" },
  { iso: "cd", fl: "&#127464&#127465;", ds: "Congo - Kinshasa", dial: "+243" },
  { iso: "ck", fl: "&#127464&#127472;", ds: "Cook Islands", dial: "+682" },
  { iso: "cr", fl: "&#127464&#127479;", ds: "Costa Rica", dial: "+506" },
  { iso: "hr", fl: "&#127469&#127479;", ds: "Croatia", dial: "+385" },
  { iso: "cu", fl: "&#127464&#127482;", ds: "Cuba", dial: "+53" },
  { iso: "cw", fl: "&#127464&#127484;", ds: "Curaçao", dial: "+599" },
  { iso: "cy", fl: "&#127464&#127486;", ds: "Cyprus", dial: "+357" },
  { iso: "cz", fl: "&#127464&#127487;", ds: "Czechia", dial: "+420" },
  { iso: "ci", fl: "&#127464&#127470;", ds: "Côte d'Ivoire", dial: "+225" },
  { iso: "dk", fl: "&#127465&#127472;", ds: "Denmark", dial: "+45" },
  { iso: "dj", fl: "&#127465&#127471;", ds: "Djibouti", dial: "+253" },
  { iso: "dm", fl: "&#127465&#127474;", ds: "Dominica", dial: "+1767" },
  { iso: "do", fl: "&#127465&#127476;", ds: "Dominican Republic", dial: "+1" },
  { iso: "ec", fl: "&#127466&#127464;", ds: "Ecuador", dial: "+593" },
  { iso: "eg", fl: "&#127466&#127468;", ds: "Egypt", dial: "+20" },
  { iso: "sv", fl: "&#127480&#127483;", ds: "El Salvador", dial: "+503" },
  { iso: "gq", fl: "&#127468&#127478;", ds: "Equatorial Guinea", dial: "+240" },
  { iso: "er", fl: "&#127466&#127479;", ds: "Eritrea", dial: "+291" },
  { iso: "ee", fl: "&#127466&#127466;", ds: "Estonia", dial: "+372" },
  { iso: "et", fl: "&#127466&#127481;", ds: "Ethiopia", dial: "+251" },
  { iso: "fk", fl: "&#127467&#127472;", ds: "Falkland Islands", dial: "+500" },
  { iso: "fo", fl: "&#127467&#127476;", ds: "Faroe Islands", dial: "+298" },
  { iso: "fj", fl: "&#127467&#127471;", ds: "Fiji", dial: "+679" },
  { iso: "fi", fl: "&#127467&#127470;", ds: "Finland", dial: "+358" },
  { iso: "fr", fl: "&#127467&#127479;", ds: "France", dial: "+33" },
  { iso: "gf", fl: "&#127468&#127467;", ds: "French Guiana", dial: "+594" },
  { iso: "pf", fl: "&#127477&#127467;", ds: "French Polynesia", dial: "+689" },
  { iso: "tf", fl: "&#127481&#127467;", ds: "French Southern Territories", dial: "+262" },
  { iso: "ga", fl: "&#127468&#127462;", ds: "Gabon", dial: "+241" },
  { iso: "gm", fl: "&#127468&#127474;", ds: "Gambia", dial: "+220" },
  { iso: "ge", fl: "&#127468&#127466;", ds: "Georgia", dial: "+995" },
  { iso: "de", fl: "&#127465&#127466;", ds: "Germany", dial: "+49" },
  { iso: "gh", fl: "&#127468&#127469;", ds: "Ghana", dial: "+233" },
  { iso: "gi", fl: "&#127468&#127470;", ds: "Gibraltar", dial: "+350" },
  { iso: "gr", fl: "&#127468&#127479;", ds: "Greece", dial: "+30" },
  { iso: "gl", fl: "&#127468&#127473;", ds: "Greenland", dial: "+299" },
  { iso: "gd", fl: "&#127468&#127465;", ds: "Grenada", dial: "+1473" },
  { iso: "gp", fl: "&#127468&#127477;", ds: "Guadeloupe", dial: "+590" },
  { iso: "gu", fl: "&#127468&#127482;", ds: "Guam", dial: "+1671" },
  { iso: "gt", fl: "&#127468&#127481;", ds: "Guatemala", dial: "+502" },
  { iso: "gg", fl: "&#127468&#127468;", ds: "Guernsey", dial: "+44" },
  { iso: "gn", fl: "&#127468&#127475;", ds: "Guinea", dial: "+224" },
  { iso: "gw", fl: "&#127468&#127484;", ds: "Guinea-Bissau", dial: "+245" },
  { iso: "gy", fl: "&#127468&#127486;", ds: "Guyana", dial: "+592" },
  { iso: "ht", fl: "&#127469&#127481;", ds: "Haiti", dial: "+509" },
  { iso: "hm", fl: "&#127469&#127474;", ds: "Heard & McDonald Islands", dial: "+672" },
  { iso: "hn", fl: "&#127469&#127475;", ds: "Honduras", dial: "+504" },
  { iso: "hk", fl: "&#127469&#127472;", ds: "Hong Kong", dial: "+852" },
  { iso: "hu", fl: "&#127469&#127482;", ds: "Hungary", dial: "+36" },
  { iso: "is", fl: "&#127470&#127480;", ds: "Iceland", dial: "+354" },
  { iso: "in", fl: "&#127470&#127475;", ds: "India", dial: "+91" },
  { iso: "id", fl: "&#127470&#127465;", ds: "Indonesia", dial: "+62" },
  { iso: "ir", fl: "&#127470&#127479;", ds: "Iran", dial: "+98" },
  { iso: "iq", fl: "&#127470&#127478;", ds: "Iraq", dial: "+964" },
  { iso: "ie", fl: "&#127470&#127466;", ds: "Ireland", dial: "+353" },
  { iso: "im", fl: "&#127470&#127474;", ds: "Isle of Man", dial: "+44" },
  { iso: "il", fl: "&#127470&#127473;", ds: "Israel", dial: "+972" },
  { iso: "it", fl: "&#127470&#127481;", ds: "Italy", dial: "+39" },
  { iso: "jm", fl: "&#127471&#127474;", ds: "Jamaica", dial: "+1876" },
  { iso: "jp", fl: "&#127471&#127477;", ds: "Japan", dial: "+81" },
  { iso: "je", fl: "&#127471&#127466;", ds: "Jersey", dial: "+44" },
  { iso: "jo", fl: "&#127471&#127476;", ds: "Jordan", dial: "+962" },
  { iso: "kz", fl: "&#127472&#127487;", ds: "Kazakhstan", dial: "+7" },
  { iso: "ke", fl: "&#127472&#127466;", ds: "Kenya", dial: "+254" },
  { iso: "ki", fl: "&#127472&#127470;", ds: "Kiribati", dial: "+686" },
  { iso: "xk", fl: "&#127485&#127472;", ds: "Kosovo", dial: "+383" },
  { iso: "kw", fl: "&#127472&#127484;", ds: "Kuwait", dial: "+965" },
  { iso: "kg", fl: "&#127472&#127468;", ds: "Kyrgyzstan", dial: "+996" },
  { iso: "la", fl: "&#127473&#127462;", ds: "Laos", dial: "+856" },
  { iso: "lv", fl: "&#127473&#127483;", ds: "Latvia", dial: "+371" },
  { iso: "lb", fl: "&#127473&#127463;", ds: "Lebanon", dial: "+961" },
  { iso: "ls", fl: "&#127473&#127480;", ds: "Lesotho", dial: "+266" },
  { iso: "lr", fl: "&#127473&#127479;", ds: "Liberia", dial: "+231" },
  { iso: "ly", fl: "&#127473&#127486;", ds: "Libya", dial: "+218" },
  { iso: "li", fl: "&#127473&#127470;", ds: "Liechtenstein", dial: "+423" },
  { iso: "lt", fl: "&#127473&#127481;", ds: "Lithuania", dial: "+370" },
  { iso: "lu", fl: "&#127473&#127482;", ds: "Luxembourg", dial: "+352" },
  { iso: "mo", fl: "&#127474&#127476;", ds: "Macao", dial: "+853" },
  { iso: "mk", fl: "&#127474&#127472;", ds: "Macedonia", dial: "+389" },
  { iso: "mg", fl: "&#127474&#127468;", ds: "Madagascar", dial: "+261" },
  { iso: "mw", fl: "&#127474&#127484;", ds: "Malawi", dial: "+265" },
  { iso: "my", fl: "&#127474&#127486;", ds: "Malaysia", dial: "+60" },
  { iso: "mv", fl: "&#127474&#127483;", ds: "Maldives", dial: "+960" },
  { iso: "ml", fl: "&#127474&#127473;", ds: "Mali", dial: "+223" },
  { iso: "mt", fl: "&#127474&#127481;", ds: "Malta", dial: "+356" },
  { iso: "mh", fl: "&#127474&#127469;", ds: "Marshall Islands", dial: "+692" },
  { iso: "mq", fl: "&#127474&#127478;", ds: "Martinique", dial: "+596" },
  { iso: "mr", fl: "&#127474&#127479;", ds: "Mauritania", dial: "+222" },
  { iso: "mu", fl: "&#127474&#127482;", ds: "Mauritius", dial: "+230" },
  { iso: "yt", fl: "&#127486&#127481;", ds: "Mayotte", dial: "+262" },
  { iso: "mx", fl: "&#127474&#127485;", ds: "Mexico", dial: "+52" },
  { iso: "fm", fl: "&#127467&#127474;", ds: "Micronesia", dial: "+691" },
  { iso: "md", fl: "&#127474&#127465;", ds: "Moldova", dial: "+373" },
  { iso: "mc", fl: "&#127474&#127464;", ds: "Monaco", dial: "+377" },
  { iso: "mn", fl: "&#127474&#127475;", ds: "Mongolia", dial: "+976" },
  { iso: "me", fl: "&#127474&#127466;", ds: "Montenegro", dial: "+382" },
  { iso: "ms", fl: "&#127474&#127480;", ds: "Montserrat", dial: "+1664" },
  { iso: "ma", fl: "&#127474&#127462;", ds: "Morocco", dial: "+212" },
  { iso: "mz", fl: "&#127474&#127487;", ds: "Mozambique", dial: "+258" },
  { iso: "mm", fl: "&#127474&#127474;", ds: "Myanmar (Burma)", dial: "+95" },
  { iso: "na", fl: "&#127475&#127462;", ds: "Namibia", dial: "+264" },
  { iso: "nr", fl: "&#127475&#127479;", ds: "Nauru", dial: "+674" },
  { iso: "np", fl: "&#127475&#127477;", ds: "Nepal", dial: "+977" },
  { iso: "nl", fl: "&#127475&#127473;", ds: "Netherlands", dial: "+31" },
  { iso: "nc", fl: "&#127475&#127464;", ds: "New Caledonia", dial: "+687" },
  { iso: "nz", fl: "&#127475&#127487;", ds: "New Zealand", dial: "+64" },
  { iso: "ni", fl: "&#127475&#127470;", ds: "Nicaragua", dial: "+505" },
  { iso: "ne", fl: "&#127475&#127466;", ds: "Niger", dial: "+227" },
  { iso: "ng", fl: "&#127475&#127468;", ds: "Nigeria", dial: "+234" },
  { iso: "nu", fl: "&#127475&#127482;", ds: "Niue", dial: "+683" },
  { iso: "nf", fl: "&#127475&#127467;", ds: "Norfolk Island", dial: "+672" },
  { iso: "kp", fl: "&#127472&#127477;", ds: "North Korea", dial: "+850" },
  { iso: "mp", fl: "&#127474&#127477;", ds: "Northern Mariana Islands", dial: "+1670" },
  { iso: "no", fl: "&#127475&#127476;", ds: "Norway", dial: "+47" },
  { iso: "om", fl: "&#127476&#127474;", ds: "Oman", dial: "+968" },
  { iso: "pk", fl: "&#127477&#127472;", ds: "Pakistan", dial: "+92" },
  { iso: "pw", fl: "&#127477&#127484;", ds: "Palau", dial: "+680" },
  { iso: "ps", fl: "&#127477&#127480;", ds: "Palestinian Territories", dial: "+970" },
  { iso: "pa", fl: "&#127477&#127462;", ds: "Panama", dial: "+507" },
  { iso: "pg", fl: "&#127477&#127468;", ds: "Papua New Guinea", dial: "+675" },
  { iso: "py", fl: "&#127477&#127486;", ds: "Paraguay", dial: "+595" },
  { iso: "pe", fl: "&#127477&#127466;", ds: "Peru", dial: "+51" },
  { iso: "ph", fl: "&#127477&#127469;", ds: "Philippines", dial: "+63" },
  { iso: "pn", fl: "&#127477&#127475;", ds: "Pitcairn Islands", dial: "+64" },
  { iso: "pl", fl: "&#127477&#127473;", ds: "Poland", dial: "+48" },
  { iso: "pt", fl: "&#127477&#127481;", ds: "Portugal", dial: "+351" },
  { iso: "pr", fl: "&#127477&#127479;", ds: "Puerto Rico", dial: "+1" },
  { iso: "qa", fl: "&#127478&#127462;", ds: "Qatar", dial: "+974" },
  { iso: "ro", fl: "&#127479&#127476;", ds: "Romania", dial: "+40" },
  { iso: "ru", fl: "&#127479&#127482;", ds: "Russia", dial: "+7" },
  { iso: "rw", fl: "&#127479&#127484;", ds: "Rwanda", dial: "+250" },
  { iso: "re", fl: "&#127479&#127466;", ds: "Réunion", dial: "+262" },
  { iso: "ws", fl: "&#127484&#127480;", ds: "Samoa", dial: "+685" },
  { iso: "sm", fl: "&#127480&#127474;", ds: "San Marino", dial: "+378" },
  { iso: "sa", fl: "&#127480&#127462;", ds: "Saudi Arabia", dial: "+966" },
  { iso: "sn", fl: "&#127480&#127475;", ds: "Senegal", dial: "+221" },
  { iso: "rs", fl: "&#127479&#127480;", ds: "Serbia", dial: "+381" },
  { iso: "sc", fl: "&#127480&#127464;", ds: "Seychelles", dial: "+248" },
  { iso: "sl", fl: "&#127480&#127473;", ds: "Sierra Leone", dial: "+232" },
  { iso: "sg", fl: "&#127480&#127468;", ds: "Singapore", dial: "+65" },
  { iso: "sx", fl: "&#127480&#127485;", ds: "Sint Maarten", dial: "+1721" },
  { iso: "sk", fl: "&#127480&#127472;", ds: "Slovakia", dial: "+421" },
  { iso: "si", fl: "&#127480&#127470;", ds: "Slovenia", dial: "+386" },
  { iso: "sb", fl: "&#127480&#127463;", ds: "Solomon Islands", dial: "+677" },
  { iso: "so", fl: "&#127480&#127476;", ds: "Somalia", dial: "+252" },
  { iso: "za", fl: "&#127487&#127462;", ds: "South Africa", dial: "+27" },
  { iso: "gs", fl: "&#127468&#127480;", ds: "South Georgia & South Sandwich Islands", dial: "+500" },
  { iso: "kr", fl: "&#127472&#127479;", ds: "South Korea", dial: "+82" },
  { iso: "ss", fl: "&#127480&#127480;", ds: "South Sudan", dial: "+211" },
  { iso: "es", fl: "&#127466&#127480;", ds: "Spain", dial: "+34" },
  { iso: "lk", fl: "&#127473&#127472;", ds: "Sri Lanka", dial: "+94" },
  { iso: "bl", fl: "&#127463&#127473;", ds: "St Barthélemy", dial: "+590" },
  { iso: "sh", fl: "&#127480&#127469;", ds: "St Helena", dial: "+290" },
  { iso: "kn", fl: "&#127472&#127475;", ds: "St Kitts & Nevis", dial: "+1869" },
  { iso: "lc", fl: "&#127473&#127464;", ds: "St Lucia", dial: "+1758" },
  { iso: "mf", fl: "&#127474&#127467;", ds: "St Martin", dial: "+590" },
  { iso: "pm", fl: "&#127477&#127474;", ds: "St Pierre & Miquelon", dial: "+508" },
  { iso: "vc", fl: "&#127483&#127464;", ds: "St Vincent & Grenadines", dial: "+1784" },
  { iso: "sd", fl: "&#127480&#127465;", ds: "Sudan", dial: "+249" },
  { iso: "sr", fl: "&#127480&#127479;", ds: "Suriname", dial: "+597" },
  { iso: "sj", fl: "&#127480&#127471;", ds: "Svalbard & Jan Mayen", dial: "+47" },
  { iso: "sz", fl: "&#127480&#127487;", ds: "Swaziland", dial: "+268" },
  { iso: "se", fl: "&#127480&#127466;", ds: "Sweden", dial: "+46" },
  { iso: "ch", fl: "&#127464&#127469;", ds: "Switzerland", dial: "+41" },
  { iso: "sy", fl: "&#127480&#127486;", ds: "Syria", dial: "+963" },
  { iso: "st", fl: "&#127480&#127481;", ds: "São Tomé & Príncipe", dial: "+239" },
  { iso: "tw", fl: "&#127481&#127484;", ds: "Taiwan", dial: "+886" },
  { iso: "tj", fl: "&#127481&#127471;", ds: "Tajikistan", dial: "+992" },
  { iso: "tz", fl: "&#127481&#127487;", ds: "Tanzania", dial: "+255" },
  { iso: "th", fl: "&#127481&#127469;", ds: "Thailand", dial: "+66" },
  { iso: "tl", fl: "&#127481&#127473;", ds: "Timor-Leste", dial: "+670" },
  { iso: "tg", fl: "&#127481&#127468;", ds: "Togo", dial: "+228" },
  { iso: "tk", fl: "&#127481&#127472;", ds: "Tokelau", dial: "+690" },
  { iso: "to", fl: "&#127481&#127476;", ds: "Tonga", dial: "+676" },
  { iso: "tt", fl: "&#127481&#127481;", ds: "Trinidad & Tobago", dial: "+1868" },
  { iso: "tn", fl: "&#127481&#127475;", ds: "Tunisia", dial: "+216" },
  { iso: "tr", fl: "&#127481&#127479;", ds: "Turkey", dial: "+90" },
  { iso: "tm", fl: "&#127481&#127474;", ds: "Turkmenistan", dial: "+993" },
  { iso: "tc", fl: "&#127481&#127464;", ds: "Turks & Caicos Islands", dial: "+1" },
  { iso: "tv", fl: "&#127481&#127483;", ds: "Tuvalu", dial: "+688" },
  { iso: "um", fl: "&#127482&#127474;", ds: "US Outlying Islands", dial: "+1" },
  { iso: "vi", fl: "&#127483&#127470;", ds: "US Virgin Islands", dial: "+1340" },
  { iso: "ug", fl: "&#127482&#127468;", ds: "Uganda", dial: "+256" },
  { iso: "ua", fl: "&#127482&#127462;", ds: "Ukraine", dial: "+380" },
  { iso: "ae", fl: "&#127462&#127466;", ds: "United Arab Emirates", dial: "+971" },
  { iso: "gb", fl: "&#127468&#127463;", ds: "United Kingdom", dial: "+44" },
  { iso: "us", fl: "&#127482&#127480;", ds: "United States", dial: "+1" },
  { iso: "uy", fl: "&#127482&#127486;", ds: "Uruguay", dial: "+598" },
  { iso: "uz", fl: "&#127482&#127487;", ds: "Uzbekistan", dial: "+998" },
  { iso: "vu", fl: "&#127483&#127482;", ds: "Vanuatu", dial: "+678" },
  { iso: "va", fl: "&#127483&#127462;", ds: "Vatican City", dial: "+379" },
  { iso: "ve", fl: "&#127483&#127466;", ds: "Venezuela", dial: "+58" },
  { iso: "vn", fl: "&#127483&#127475;", ds: "Vietnam", dial: "+84" },
  { iso: "wf", fl: "&#127484&#127467;", ds: "Wallis & Futuna", dial: "+681" },
  { iso: "eh", fl: "&#127466&#127469;", ds: "Western Sahara", dial: "+212" },
  { iso: "ye", fl: "&#127486&#127466;", ds: "Yemen", dial: "+967" },
  { iso: "zm", fl: "&#127487&#127474;", ds: "Zambia", dial: "+260" },
  { iso: "zw", fl: "&#127487&#127484;", ds: "Zimbabwe", dial: "+263" },
  { iso: "ax", fl: "&#127462&#127485;", ds: "Åland Islands", dial: "+672" },
];

/** Same value the original script built as `country.ref` (used for searching). */
const countryRef = (c: Country): string => `${c.ds} ${c.dial}`;

/* ------------------------------------------------------------------ */
/* UTM / lead-source auto-capture                                      */
/* ------------------------------------------------------------------ */

interface TrackingValues {
  /** POTENTIALCF4 – Lead Page URL */
  leadPageUrl: string;
  /** POTENTIALCF5 – UTM Source */
  utmSource: string;
  /** POTENTIALCF7 – UTM Campaign */
  utmCampaign: string;
  /** POTENTIALCF6 – UTM Content */
  utmContent: string;
}

const EMPTY_TRACKING: TrackingValues = {
  leadPageUrl: "",
  utmSource: "",
  utmCampaign: "",
  utmContent: "",
};

/** Zoho caps these fields at 255 characters. */
const truncate = (value: string, max = 255) =>
  value.length > max ? value.slice(0, max) : value;

function readStoredUtm(key: string): Partial<TrackingValues> {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as Partial<TrackingValues>) : {};
  } catch {
    return {};
  }
}

function writeStoredUtm(key: string, values: TrackingValues) {
  try {
    window.sessionStorage.setItem(
      key,
      JSON.stringify({
        utmSource: values.utmSource,
        utmCampaign: values.utmCampaign,
        utmContent: values.utmContent,
      })
    );
  } catch {
    /* private mode / storage disabled – tracking just won't persist */
  }
}

/** Used only when the URL carries no utm_source. */
function deriveSource(params: URLSearchParams): string {
  if (params.get("gclid") || params.get("gbraid") || params.get("wbraid")) {
    return "Google Ads";
  }
  if (params.get("fbclid")) return "Meta Ads";

  const referrer = document.referrer;
  if (!referrer) return "direct";
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    // Internal navigation tells us nothing about the original source.
    return host === window.location.hostname.replace(/^www\./, "") ? "" : host;
  } catch {
    return "";
  }
}

/**
 * Reads the four tracking values from the current URL, falling back to the
 * values captured earlier in this browsing session (so a visitor can land on
 * `/?utm_source=…`, browse around, and still submit the right attribution).
 */
function collectTracking(storageKey: string): TrackingValues {
  const params = new URLSearchParams(window.location.search);
  const stored = readStoredUtm(storageKey);

  const fromUrl = (name: string) => (params.get(name) ?? "").trim();
  const hasUtmInUrl =
    !!fromUrl("utm_source") || !!fromUrl("utm_campaign") || !!fromUrl("utm_content");

  const values: TrackingValues = {
    leadPageUrl: truncate(window.location.href),
    utmSource: truncate(
      fromUrl("utm_source") || stored.utmSource || deriveSource(params)
    ),
    utmCampaign: truncate(fromUrl("utm_campaign") || stored.utmCampaign || ""),
    utmContent: truncate(fromUrl("utm_content") || stored.utmContent || ""),
  };

  if (hasUtmInUrl || !stored.utmSource) writeStoredUtm(storageKey, values);

  return values;
}

/* ------------------------------------------------------------------ */
/* Stylesheet (original Zoho form CSS, injected with the component)    */
/* ------------------------------------------------------------------ */

const BIGIN_FORM_CSS = `
/* COMMON STYLES */
:root,
html {
  font-size: 10px;
}
.wf-parent * {
  padding: 0;
  margin: 0;
  outline: 0;
}
.wf-parent {
  font-weight: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #edf1f4;
  font-size: 15px;
}
.wf-parent ul,
.wf-parent ol {
  list-style-position: inside;
}
.wf-parent textarea,
.wf-parent input[type='text'],
.wf-parent input[type='button'],
.wf-parent input[type='submit'],
.wf-parent input[type='date'] {
  -webkit-appearance: none;
}
.wf-parent input:focus,
.wf-parent select:focus,
.wf-parent textarea:focus,
.wf-parent button:focus {
  outline: none;
}
.link {
  color: #1980d8;
  cursor: pointer;
}
.cP {
  cursor: pointer;
}
.flex-center-v {
  display: flex;
  align-items: center;
}
/* COMMON STYLES */
.wf-form-component {
  padding: 30px 40px 60px;
}
.wf-form-paid {
  padding-bottom: 45px;
}
.wf-parent {
  padding: 30px 0;
  height: 100%;
  box-sizing: border-box;
  overflow: auto;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.wf-wrapper * {
  box-sizing: border-box;
}
.wf-wrapper {
  width: 100%;
  max-width: 700px;
  border-radius: 10px;
  margin: auto;
  border: none;
  background-color: #fff;
  color: #222;
  box-shadow: 0px 0px 2px 0 #00000033;
}
.iframe-container {
  height: 100%;
  width: 100%;
  border: none;
  min-height: 365px;
}
.wf-logo {
  display: flex;
  margin-bottom: 30px;
  max-height: 60px;
  justify-content: center;
}
.wf-logo[data-ux-logo-size='lg'] {
  height: 60px;
}
.wf-logo[data-ux-logo-size='md'] {
  height: 50px;
}
.wf-logo[data-ux-logo-size='sm'] {
  height: 30px;
}
.wf-logo[data-ux-logo-pos='left'] {
  justify-content: left;
}
.wf-logo[data-ux-logo-pos='center'] {
  justify-content: center;
}
.wf-logo[data-ux-logo-pos='right'] {
  justify-content: right;
}
.wf-header {
  font-size: 22px;
  padding-bottom: 35px;
  font-weight: bold;
  word-break: break-word;
}
.wf-sec-wrap {
  margin-bottom: 40px;
}
.wf-sec-wrap:first-child .wf-sec-head {
  margin-top: 0;
}
.wf-sec-head {
  margin-bottom: 20px;
  margin-top: 35px;
}
.wf-sec-title {
  font-size: 18px;
  font-weight: bold;
  word-break: break-word;
}
.wf-sec-desc {
  margin: 0;
  margin-top: 5px;
  word-break: break-word;
}
.wf-row {
  margin-bottom: 20px;
}
.wf-row-with-supplementary {
  margin-bottom: 10px;
}
.wf-label {
  padding: 7px 0;
  word-break: break-word;
}
.wf-field:not(.multiple-fields-div) {
  text-align: left;
  word-break: break-word;
  border: 0;
  position: relative;
}
.wf-field-inner {
  position: relative;
  display: flex;
  flex: 1;
}
.wf-field-input:focus {
  border: 1px solid #1980d8;
}
.wf-field-dropdown .wf-field-input:focus {
  border: none; /* multipicklist search */
}
.wf-input-focus.wf-field::after {
  opacity: 1;
}
.wf-input-focus.wf-field::after,
.wf-field-error-active.wf-field .wf-field-error {
  display: block;
}
.wf-field-error-active.wf-field .wf-error-view-more {
  display: flex;
}
.wf-field-error-active.wf-field .wf-field-input:not(.date-input-container .wf-field-input),
.wf-field-error-active.wf-field .wf-field-dropdown,
.wf-field-error-active .date-input-container {
  border: 1px solid #fd6b6d;
  box-shadow: 0 0 1px 1px #f4a2a2;
}
.wf-field-mandatory .wf-field-inner::before {
  content: '';
  position: absolute;
  inset-inline-start: 0px;
  background-color: #ff6a6a;
  width: 3px;
  height: 100%;
  border-start-start-radius: 4px;
  border-end-start-radius: 4px;
  z-index: 2;
  top: 0;
  bottom: 0;
}
.wf-field-mandatory .wf-field-inner.no-results-elem::before {
  height: 98%;
}
.wf-field-input,
.wf-field-dropdown {
  width: 100%;
  border: 1px solid #bdc8d3;
  border-radius: 4px;
  padding: 10px 15px;
  min-height: 38px;
  font-size: 15px;
  font-family: inherit;
}
.wf-parent select:not([data-wform-field='select-multiple']) {
  -webkit-appearance: none;
  -moz-appearance: none;
  background: transparent;
  background-image: url("data:image/svg+xml;utf8,<svg fill='black' height='34' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>");
  background-repeat: no-repeat;
  background-position-x: 99%;
  background-color: #fff;
  min-width: 70px;
}
.wf-parent input,
.wf-parent select {
  background-color: #fff;
}
.wf-field-item {
  min-height: 38px;
}
.wf-time-field-wrapper {
  display: flex;
  flex: 1;
}
.wf-time-field-wrapper select {
  margin-left: 10px;
}
.wf-form-component .wf-field-error,
.wf-form-component .wf-field-help-text {
  text-align: left;
}
.wf-form-component .wf-field-error {
  text-align: right;
}
.wf-field-error {
  color: #ff5050;
  font-size: 12px;
  margin-top: 4px;
  display: none;
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}
.wf-field-error-long {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.wf-error-view-more {
  font-size: 12px;
  display: none;
  white-space: nowrap;
  align-items: center;
  color: #1880d8;
  margin-top: 4px;
}
.wf-error-view-more:hover {
  text-decoration: underline;
  cursor: pointer;
}
.wf-error-parent-ele {
  display: flex;
  justify-content: end;
}
.wf-field-help-text {
  color: #515159;
  font-size: 12px;
  margin-top: 5px;
}
.wf-field-help-text + .wf-error-parent-ele .wf-field-error,
.wf-field-help-text + .wf-error-parent-ele .wf-error-view-more {
  margin: 0;
}
.wf-field-help-text-link {
  text-decoration: none;
}
.wf-field-checkbox {
  cursor: pointer;
  border-radius: 3px;
  min-width: 14px;
  min-height: 20px;
  box-sizing: initial;
  accent-color: #1980d8;
  margin-inline-end: 10px;
  margin-bottom: auto;
}
.wf-field-dropdown-date {
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 15px;
  cursor: pointer;
}
.wf-field-dropdown-date {
  border: 1px solid #bdc8d3;
}
.wf-field-dropdown-date:hover {
  border: 1px solid #65c199;
}
.wform-field-item-upload-input {
  min-height: 5rem;
  background-color: #fbfcfd;
  border: 1px dashed #bdc8d3;
  line-height: 2.1;
  cursor: pointer;
}
.wform-field-item-upload-input:focus {
  border: 1px dashed #bdc8d3;
}
.wform-file-upload-input-label {
  background-color: #fff;
  background-image: linear-gradient(to top, #f5f8fa, #ffffff);
  color: #212129;
  border-color: #d3dbe3;
  border: 1px solid #d3dbe3;
  border-radius: 4px;
  padding: 0.7rem 2rem;
  font-size: 1.4rem;
  inset-inline-end: 1rem;
  transform: translateY(-50%);
  top: 50%;
  position: absolute;
}
.wf-parent input[type='file']::file-selector-button,
.wf-parent input[type='file']::-webkit-file-upload-button {
  opacity: 0;
  width: 0;
  height: 28px;
}
.wf-row[data-ux-field-appearance='captcha'] .wf-field {
  display: flex;
  align-items: center;
}
.wform-field-item-captcha-input {
  border-start-end-radius: 0;
  border-end-end-radius: 0;
}
.wf-field-captcha-img-wrap {
  border: 1px solid #bdc8d3;
  border-radius: 4px;
  border-inline-start: 0;
  border-start-start-radius: 0;
  border-end-start-radius: 0;
  height: initial;
  overflow: hidden;
  min-width: 120px;
}
.wf-field-captcha-img {
  height: 38px;
  width: 100%;
}
.reload-img {
  font-size: 23px;
  color: #4b5569;
  margin-inline-end: 5px;
}
.reload-captcha {
  margin-inline-start: 10px;
  user-select: none;
}
.wf-btn {
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 15px;
  cursor: pointer;
  font-weight: bold;
  font-family: inherit;
}
.wf-btn[data-ux-btn-type='default'] {
  border-radius: 0;
}
.wf-btn[data-ux-btn-type='primary'] {
  border-radius: 4px;
}
.wf-btn[data-ux-btn-type='secondary'] {
  border-radius: 20px;
}
.wform-btn-wrap {
  display: flex;
  margin-top: 40px;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
}
.wform-poweredby-container {
  position: absolute;
  inset-inline-start: 0;
  bottom: 0;
  border-start-end-radius: 10px;
  border-end-start-radius: 10px;
  background-color: #23384f;
  font-size: 13px;
  padding: 6px 8px;
  font-family: sans-serif;
  display: flex;
  align-items: center;
}
.wf-text-area-input {
  resize: vertical;
  height: 100px;
  min-height: 100px;
  max-height: 200px;
}
.dropdown-contents::after {
  border-left: 0.4rem solid transparent;
  border-right: 0.4rem solid transparent;
  border-top: 0.4rem solid black;
  top: 45%;
  content: '';
  position: absolute;
  inset-inline-end: 1rem;
  pointer-events: none;
}

/* ==================== * MultiPicklist Styles * ==================== */
.multiselect.wf-field-dropdown {
  padding: 0;
  cursor: text;
  position: relative;
}
.multiselect.dropbox-active {
  border-color: #1980d8;
  border-radius: 4px 4px 0 0;
}
.multiselect.dropbox-active.dropdownTop:not(.ux-pick-mixed .multiselect.dropbox-active) {
  border-radius: 0 0 4px 4px;
}
.multiselect.dropbox-active.dropdownTop:not(.ux-pick-mixed .multiselect.dropbox-active) .dropdown-input {
  min-height: 36px;
  border-radius: 0 0 4px 4px;
}
.multiselect.no-results-elem {
  border-radius: 4px;
}
.selected-options.selected-options-field {
  display: none;
}
.selected-options {
  max-height: 150px;
  overflow: auto;
  padding: 3px 5px 7px 5px;
  border-radius: 4px 4px 0 0;
  border-bottom: 0;
  min-height: 38px;
  height: 38px;
  transition: 0.3s all;
  scroll-behavior: smooth;
}
.selected-options.hide-opt-list {
  min-height: 0;
  height: 0;
  padding: 0;
}
.selected-options.set-opt-list {
  height: auto;
}
.selected-options.drp-dwn-no-val {
  border-right: unset !important;
}
.dropdown-input.drop-box-closed {
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
}
.dropdown-input.drop-box-active {
  border-top-right-radius: 0 !important;
  border-radius: 4px;
}
.dN {
  display: none !important;
}
.dropdown {
  position: relative;
  width: 100%;
  height: 36px;
  transition: 0.3s all;
}
.dropdown.hide-dropdown {
  height: 0;
}
.dropdown-input {
  width: 100%;
  border: none;
  outline: none;
  height: 30px;
  padding: 5px;
  border-radius: 4px;
  border-radius: 4px 4px 0 0;
  padding-left: 14px;
}
.dropdown-input::placeholder {
  color: #919191;
  font-size: 14px;
}
.dropdown-menu {
  position: absolute;
  display: none;
  background-color: #fff;
  border: 1px solid #bdc8d3;
  border-radius: 0 0 5px 5px;
  max-height: 300px;
  overflow-y: auto;
  width: calc(100% + 2px);
  left: -1px;
  z-index: 3;
  top: 37px;
  transition: 0.3s all;
}
.dropdown-menu.hide-the-inp {
  top: 0;
}
.dropdown.open .dropdown-menu {
  display: block;
}
.dropdown-menu.dropdown-focus {
  border-color: #1980d8;
  border-top: 1px solid #e6ebf1;
}
.dropdown-menu.dropdown-focus.dropdownTop:not(.ux-pick-mixed .dropdown-menu.dropdown-focus) {
  border-top: 1px solid #1980d8;
  border-radius: 5px 5px 0 0;
}
.multiselect.dropbox-active .dropdown-input {
  border-top: 0;
  border-bottom: 0;
  padding-bottom: 17px;
  padding-top: 19px;
  border-left-color: transparent;
}
.multi-tag {
  background-color: #ceebff;
  padding-inline-end: 5px !important;
  padding-inline-start: 10px !important;
  padding: 2px 5px 3px 10px;
  border-radius: 15px;
  margin: 5px 5px 0 2px;
  display: inline-flex;
  max-width: 96%;
}
.tag-data-val {
  cursor: default;
  max-width: 550px;
}
.no-results {
  cursor: default !important;
  text-align: center;
  color: #919191;
  font-size: 14px;
}
.no-results:hover {
  background-color: unset !important;
}
.opt-hide {
  display: none;
}
.opt-show {
  display: block;
}
.tag-close-btn {
  margin-inline-start: 3px;
  padding: 0px 4px 0px;
  border-radius: 50%;
  opacity: 0.5;
  font-weight: bold;
  cursor: pointer;
}
.multi-tag:hover .tag-close-btn {
  opacity: 1;
}
.option {
  padding: 10px 14px;
  cursor: pointer;
  border-bottom: 1px solid #f0f5f8;
}
.option:hover {
  background-color: #f5f8fa;
}
.input-not-active {
  display: none;
}
.ellipsis {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
/* ==================== * MultiPicklist Styles * ==================== */

.ux-pick-mixed .dropdown-contents {
  padding: 3.5px 10px;
  height: 100%;
}
.ux-pick-mixed .dropdown-menu {
  width: max-content;
  max-width: 30rem;
  top: 42px;
  border: 1px solid #d2dbe5;
  border-radius: 4px;
  box-shadow: 0 1px 15px 0 rgba(0, 0, 0, 0.2);
}
.ux-pick-mixed .dropdown-menu .option[data-selected='true'] {
  background-color: #e2f3fc;
  font-weight: 600;
}
.ux-pick-mixed .wf-field-dropdown.dropbox-active::after {
  content: '';
  border: 2px solid #1980d8;
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  box-sizing: border-box;
  z-index: 1;
}
.ux-pick-mixed .wf-field-item:not(.selected-options) {
  min-height: 36px;
}
.wf-form-component:not([data-ux-form-alignment='top']) .multiple-fields-div {
  width: 70%;
}
.icon-with-text-dropdown .dropdown > span {
  margin-inline-end: 10px;
}
.icon-with-text-dropdown .icon-text-dropdown {
  display: flex;
  align-items: center;
}
.icon-with-text-dropdown .option {
  padding: 4px 14px;
}
.dropdown-with-search .dropdown.open .dropdown-menu {
  display: flex;
  flex-direction: column;
}
.dropdown-with-search .dropdown-items-wrapper {
  flex-grow: 1;
  overflow-y: auto;
}
.multiple-fields-div {
  display: flex;
  flex-direction: column;
}
.multiple-fields-div.flex-1-5 .field-1 {
  flex: 1;
}
.multiple-fields-div.flex-1-5 .field-2 {
  flex: 5;
}
.multiple-fields-div .wf-field-dropdown {
  border-radius: 4px 0px 0px 4px;
  border-right: 0;
}
.multiple-fields-div .wf-field-item:not(.selected-options) {
  border-radius: 0px 4px 4px 0px;
}
.multiple-fields-div.wf-field {
  word-break: unset;
}
.dropdown-menu .dropdown-search-input {
  padding: 5px 10px;
  width: 92%;
  margin: 10px;
  border: 1px solid #cdd8e3;
  border-radius: 4px;
}
.dropdown-menu .dropdown-search-input:hover {
  border: 1px solid #1980d8;
}
.dropdown-menu .dropdown-search-input:focus {
  border: 2px solid #1980d8;
}
/* RTL Css change start */
[dir='rtl'] .multiple-fields-div .wf-field-item:not(.selected-options) {
  border-radius: 4px 0px 0px 4px;
}
[dir='rtl'] .multiple-fields-div .wf-field-dropdown {
  border-radius: 0px 4px 4px 0px;
  border-left: 0;
  border-right: 1px solid #bdc8d3;
}
[dir='rtl'] .ux-pick-mixed .dropdown-menu {
  right: -1px;
}
[dir='rtl'] .wf-form-component[data-ux-form-alignment='left'] .wf-label {
  padding-left: 2rem;
  padding-right: 0;
}
[dir='rtl'] .wf-time-field-wrapper select {
  margin-left: 0px;
  margin-right: 10px;
}
[dir='rtl'] .wf-calendar-nav-icons.nav-icon-with-space {
  margin-left: 10px;
}
[dir='rtl'] .wf-form-component .wf-field-help-text {
  text-align: right;
}
/* RTL Css change end */

/* ==================== *** Form Alignment *** ==================== */
.wf-form-component:not([data-ux-form-alignment='top']) .wf-row {
  display: flex;
}
.wf-form-component:not([data-ux-form-alignment='top']) .wf-label {
  word-break: break-word;
  width: 30%;
  padding: 1.2rem 2rem 0;
}
.wf-form-component[data-ux-form-alignment='left'] .wf-label {
  text-align: left;
  padding-left: 0;
}
.wf-form-component[data-ux-form-alignment='right'] .wf-label {
  text-align: right;
}
.wf-form-component[data-ux-form-alignment='center'] .wf-label {
  text-align: center;
}
.wform-btn-wrap[data-ux-pos='left'] {
  justify-content: flex-start;
}
.wform-btn-wrap[data-ux-pos='center'] {
  justify-content: center;
}
.wform-btn-wrap[data-ux-pos='right'] {
  justify-content: flex-end;
}
.wf-form-component:not([data-ux-form-alignment='top']) .wf-field {
  width: 70%;
}
.wf-form-component[data-ux-form-alignment='top'] .wf-label {
  padding-top: 0;
}
.wf-form-component[data-ux-form-alignment='top'] .reload-captcha {
  text-align: right;
}
.wf-row[data-ux-field-appearance='captcha'] .wf-field-inner {
  height: 38px;
}
.wf-row[data-ux-field-appearance='captcha'] .wf-field.wf-field-error-active {
  flex-wrap: wrap;
}
.wf-row[data-ux-field-appearance='captcha'] .wf-field-error {
  flex-basis: 100%;
  width: 100%;
  margin-inline-start: 5px;
}
/* ==================== *** Form Alignment ends *** ==================== */

/* ==================== *** css animations *** ==================== */
@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
/* ==================== *** css animations ends *** ==================== */

/* ==================== *** Mediaquery *** ==================== */
@media screen and (max-width: 1024px) {
  .wf-wrapper {
    max-width: 700px;
    width: calc(100% - 40px);
    border: 0;
  }
  .wf-field input[type='text'],
  .wf-field select,
  .wf-field textarea {
    width: 100% !important;
  }
  .wf-label:empty {
    display: none;
  }
  .wf-field-checkbox {
    min-width: 18px;
    min-height: 18px;
  }
}
@media screen and (max-width: 768px) {
  .wf-wrapper {
    max-width: 700px;
    width: calc(100% - 40px);
    border: 0;
  }
  .wf-field input[type='text'],
  .wf-field select,
  .wf-field textarea {
    width: 100% !important;
  }
  .wf-label:empty {
    display: none;
  }
  .wf-form-component[data-ux-form-alignment='top'] .wform-btn-wrap {
    justify-content: flex-start;
  }
}
@media screen and (max-width: 590px) {
  .wf-parent {
    padding: 20px 0;
  }
  .wf-wrapper {
    width: calc(100% - 40px) !important;
    border: 0;
  }
  .wf-form-component {
    padding: 20px;
    padding-bottom: 60px;
  }
  .wf-field input[type='text'],
  .wf-field select,
  .wf-field textarea {
    width: 100% !important;
  }
  .wf-label:empty {
    display: none;
  }
  .wf-row[data-ux-field-appearance='date-time'] .wf-field-inner {
    flex-direction: column;
  }
  .wf-row[data-ux-field-appearance='date-time'] .wf-time-field-wrapper {
    margin-top: 10px;
  }
  .wf-row[data-ux-field-appearance='date-time'] .wf-field-item:first-child {
    margin-left: 0;
  }
  .wf-row[data-ux-field-appearance='date-time'] .wf-field-item {
    flex: 1;
  }
  .wf-row[data-ux-field-appearance='captcha'] .wf-field {
    flex-direction: column;
  }
  .wf-row[data-ux-field-appearance='captcha'] .reload-captcha {
    margin-left: auto;
  }
  .wf-row[data-ux-field-appearance='captcha'] .wf-field-inner {
    width: 100%;
  }
}
/* ==================== *** Mediaquery ends *** ==================== */
`;

/* ------------------------------------------------------------------ */
/* Constants copied straight from the original Zoho embed code        */
/* ------------------------------------------------------------------ */

const FORM_ID = "BiginWebToRecordForm7522188000000623170";
const FORM_PARENT_ID = "BiginWebToRecordFormParent7522188000000623170";
const FORM_DIV_ID = "BiginWebToRecordFormDiv7522188000000623170";
const ELEMENT_DIV_ID = "elementDiv7522188000000623170";

const XNQSJSDP =
  "98ea7a89a13df0f9f658580a9c875ee0d21ba946b68372ddf0da4593eef8fd0d";
const XMIWTLD =
  "81a6928171067053d2d0cf6ca3a3a766a669f320f445ceae5ed81fcabe8440f54d3dee36d6eeb852887b36e4cbe363b7";
const ACTION_TYPE = "UG90ZW50aWFscw==";

const RECAPTCHA_SITE_KEY = "6LdFqIQtAAAAAO8ZlutxG0RSjH__U8T2ycZiHjD5";
const WF_SCRIPT_SRC = `https://bigin.zoho.com/crm/WebformScriptServlet?rid=${XMIWTLD}gid${XNQSJSDP}&findip=true`;

/**
 * sessionStorage key for the captured UTM values. Derived from the form id so
 * two different Bigin forms on the same site never share a bucket.
 */
const UTM_STORAGE_KEY = `bigin_utm_${FORM_ID}`;

/** mndFields7522188000000623170 */
const MND_FIELDS = [
  "Potential Name",
  "Accounts.Account Name",
  "Contacts.Mobile",
  "Contacts.Email",
  "POTENTIALCF1",
  "POTENTIALCF2",
  "Description",
] as const;

/** fldLangVal7522188000000623170 */
const FLD_LANG_VAL: Record<(typeof MND_FIELDS)[number], string> = {
  "Potential Name": "Name",
  "Accounts.Account Name": "Company Name",
  "Contacts.Mobile": "Mobile",
  "Contacts.Email": "Email",
  POTENTIALCF1: "Service Interested In?",
  POTENTIALCF2: "When do you want to start?",
  Description: "Tell Us About Your Requirement",
};

/** DOM order, used to focus the first field in error (same as the original). */
const FOCUS_ORDER = [
  "Potential Name",
  "Accounts.Account Name",
  "Contacts.Mobile",
  "Contacts.Email",
  "POTENTIALCF1",
  "POTENTIALCF2",
  "Description",
  "recaptcha",
];

const EMAIL_REGEX =
  /^([A-Za-z0-9-._%'+/]+@[A-Za-z0-9.-]+.[a-zA-Z]{2,22})$/;

type Errors = Record<string, string>;

/* ------------------------------------------------------------------ */
/* Field error (with the original "View More" behaviour)              */
/* ------------------------------------------------------------------ */

function FieldError({ message }: { message?: string }) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [truncated, setTruncated] = useState(false);

  useLayoutEffect(() => {
    setExpanded(false);
    const span = spanRef.current;
    const parent = span?.closest(".wf-field") as HTMLElement | null;
    if (!span || !parent) {
      setTruncated(false);
      return;
    }
    setTruncated(span.scrollWidth > parent.offsetWidth);
  }, [message]);

  if (!message) return null;

  const showViewMore = truncated && !expanded;

  return (
    <div className="wf-error-parent-ele">
      <span
        ref={spanRef}
        className={`wf-field-error${showViewMore ? " wf-field-error-long" : ""}`}
      >
        {message}
      </span>
      {showViewMore && (
        <span
          className="wf-error-view-more"
          onClick={() => setExpanded(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && setExpanded(true)}
        >
          View More
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Props                                                              */
/* ------------------------------------------------------------------ */

export interface BiginWebToRecordFormProps {
  /**
   * Zoho endpoint the form posts to. The snippet you pasted had no `action`
   * attribute – copy the exact URL from your Bigin embed code if it differs.
   */
  action?: string;
  /** `returnURL` hidden field. */
  returnURL?: string;
  /** Country used before the Zoho IP-lookup script resolves one. */
  defaultCountryIso?: string;
  /**
   * Hide the four auto-filled tracking rows (Lead Page URL, UTM Source,
   * UTM Campaign, UTM Content). They still post their values.
   */
  hideTrackingFields?: boolean;
  /** Form heading. */
  title?: string;
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */

export default function BiginWebToRecordForm({
  action = "https://bigin.zoho.com/crm/WebToPotentialForm",
  returnURL = "null",
  defaultCountryIso = "in",
  hideTrackingFields = true,
  title = "MS Get Quote",
  className,
}: BiginWebToRecordFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const dialCodeRef = useRef<HTMLInputElement>(null);
  const recaptchaRef = useRef<HTMLDivElement | null>(null);
  const recaptchaWidgetId = useRef<number | null>(null);
  const countryBoxRef = useRef<HTMLDivElement>(null);
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({});

  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaReady, setCaptchaReady] = useState(false);
  const [countryIso, setCountryIso] = useState(defaultCountryIso);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [tracking, setTracking] = useState<TrackingValues>(EMPTY_TRACKING);

  const trackingRowStyle = hideTrackingFields
    ? ({ display: "none" } as const)
    : undefined;

  const selectedCountry: Country =
    countries.find((c) => c.iso === countryIso) ??
    countries.find((c) => c.iso === "in")!;

  const filteredCountries = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter((c) => countryRef(c).toLowerCase().includes(q));
  }, [search]);

  const setRef = useCallback(
    (name: string) => (el: HTMLElement | null) => {
      fieldRefs.current[name] = el;
    },
    []
  );

  const clearError = useCallback((name: string) => {
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const fieldClass = (base: string, name: string) =>
    `${base}${errors[name] ? " wf-field-error-active" : ""}`;

  /* ---------------- UTM / lead page auto-fill ---------------- */

  useEffect(() => {
    setTracking(collectTracking(UTM_STORAGE_KEY));
  }, []);

  /* ---------------- reCAPTCHA (explicit render) ---------------- */

  useEffect(() => {
    const w = window as any;
    if (w.grecaptcha?.render) {
      setCaptchaReady(true);
      return;
    }
    const cbName = "__biginRecaptchaOnLoad";
    const prev = w[cbName];
    w[cbName] = () => {
      prev?.();
      setCaptchaReady(true);
    };
    if (!document.getElementById("bigin-recaptcha-script")) {
      const s = document.createElement("script");
      s.id = "bigin-recaptcha-script";
      s.src = `https://www.google.com/recaptcha/api.js?onload=${cbName}&render=explicit`;
      s.async = true;
      s.defer = true;
      document.head.appendChild(s);
    }
  }, []);

  useEffect(() => {
    const w = window as any;
    if (
      !captchaReady ||
      !recaptchaRef.current ||
      recaptchaWidgetId.current !== null ||
      !w.grecaptcha?.render
    ) {
      return;
    }
    recaptchaWidgetId.current = w.grecaptcha.render(recaptchaRef.current, {
      sitekey: RECAPTCHA_SITE_KEY,
      theme: "light",
      callback: () => {
        setCaptchaVerified(true);
        clearError("recaptcha");
      },
      "expired-callback": () => setCaptchaVerified(false),
    });
  }, [captchaReady, clearError]);

  /* ---------------- Zoho webform script (IP → dial code) ---------------- */

  useEffect(() => {
    const applyIpCountry = () => {
      const local = (window as any).localCode as string | undefined;
      if (local && countries.some((c) => c.iso === local)) setCountryIso(local);
    };
    const existing = document.getElementById("wf_script");
    if (existing) {
      applyIpCountry();
      return;
    }
    const s = document.createElement("script");
    s.id = "wf_script";
    s.src = WF_SCRIPT_SRC;
    s.onload = applyIpCountry;
    document.body.appendChild(s);
  }, []);

  /* ---------------- Close the country dropdown on outside click ---------------- */

  useEffect(() => {
    if (!dropdownOpen) return;
    const onDocClick = (e: MouseEvent) => {
      if (
        countryBoxRef.current &&
        !countryBoxRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [dropdownOpen]);

  /* ---------------- Validation ---------------- */

  const validate = (): Errors => {
    const form = formRef.current;
    const errs: Errors = {};
    if (!form) return errs;

    // checkMandatory
    MND_FIELDS.forEach((name) => {
      const label = FLD_LANG_VAL[name];

      if (name === "Contacts.Mobile") {
        if (!(phoneRef.current?.value ?? "").replace(/^\s+|\s+$/g, "")) {
          errs[name] = `${label} cannot be empty`;
        }
        return;
      }

      const el = form.elements.namedItem(name) as
        | HTMLInputElement
        | HTMLSelectElement
        | HTMLTextAreaElement
        | null;
      if (!el) return;

      const value = (el.value || "").replace(/^\s+|\s+$/g, "");
      if (!value) {
        errs[name] = `${label} cannot be empty`;
      } else if (el.nodeName === "SELECT" && el.value === "-None-") {
        errs[name] = `${label} cannot be none.`;
      }
    });

    // validateFields → email
    const email = form.elements.namedItem("Contacts.Email") as
      | HTMLInputElement
      | null;
    if (email?.value && !EMAIL_REGEX.test(email.value)) {
      errs["Contacts.Email"] = `Enter valid ${FLD_LANG_VAL["Contacts.Email"]}`;
    }

    // validatePhone → digits only (rest_alpha)
    const phone = phoneRef.current?.value ?? "";
    if (phone && !/^[0-9]+$/.test(phone)) {
      errs["Contacts.Mobile"] = "Enter only numbers";
    }

    // validateReCaptcha
    if (!captchaVerified) {
      errs.recaptcha =
        "Please check the reCAPTCHA box before submitting the form.";
    }

    return errs;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    (document as any).charset = "UTF-8";

    const errs = validate();
    setErrors(errs);

    const errorKeys = Object.keys(errs);
    if (errorKeys.length) {
      e.preventDefault();
      const first = FOCUS_ORDER.find((k) => errs[k]) ?? errorKeys[0];
      window.setTimeout(() => fieldRefs.current[first]?.focus(), 0);
      return;
    }

    // Prefix the hidden Contacts.Mobile field with the selected dial code.
    if (dialCodeRef.current) {
      dialCodeRef.current.value = phoneRef.current?.value
        ? selectedCountry.dial + phoneRef.current.value
        : "";
    }

    setSubmitting(true); // mirrors formsubmit.disabled = true
  };

  /* ---------------- Render ---------------- */

  return (
    <div
      className={`wf-parent${className ? ` ${className}` : ""}`}
      id={FORM_PARENT_ID}
      style={{ backgroundColor: "#EAEEF2" }}
    >
      <style dangerouslySetInnerHTML={{ __html: BIGIN_FORM_CSS }} />
      <div className="wf-wrapper" id={FORM_DIV_ID}>
        <form
          ref={formRef}
          id={FORM_ID}
          name={FORM_ID}
          className="wf-form-component"
          data-ux-form-alignment="top"
          style={{ fontFamily: "Arial", position: "relative", fontSize: "15px" }}
          method="POST"
          action={action}
          encType="multipart/form-data"
          acceptCharset="UTF-8"
          onSubmit={handleSubmit}
        >
          {/* Do not remove this code. */}
          <input type="text" style={{ display: "none" }} name="xnQsjsdp" defaultValue={XNQSJSDP} readOnly />
          <input type="hidden" name="zc_gad" id="zc_gad" defaultValue="" />
          <input type="text" style={{ display: "none" }} name="xmIwtLD" defaultValue={XMIWTLD} readOnly />
          <input type="text" style={{ display: "none" }} name="actionType" defaultValue={ACTION_TYPE} readOnly />
          <input type="text" style={{ display: "none" }} name="returnURL" defaultValue={returnURL} readOnly />

          <div className="wf-header">{title}</div>

          <div id={ELEMENT_DIV_ID} className="wf-form-wrapper">
            {/* Name */}
            <div className="wf-row">
              <div className="wf-label">Name</div>
              <div className={fieldClass("wf-field wf-field-mandatory", "Potential Name")}>
                <div className="wf-field-inner">
                  <input
                    ref={setRef("Potential Name")}
                    name="Potential Name"
                    maxLength={120}
                    type="text"
                    className="wf-field-item wf-field-input"
                    onInput={() => clearError("Potential Name")}
                  />
                </div>
                <FieldError message={errors["Potential Name"]} />
              </div>
            </div>

            {/* Company Name */}
            <div className="wf-row">
              <div className="wf-label">Company Name</div>
              <div className={fieldClass("wf-field wf-field-mandatory", "Accounts.Account Name")}>
                <div className="wf-field-inner">
                  <input
                    ref={setRef("Accounts.Account Name")}
                    name="Accounts.Account Name"
                    maxLength={200}
                    type="text"
                    className="wf-field-item wf-field-input"
                    onInput={() => clearError("Accounts.Account Name")}
                  />
                </div>
                <FieldError message={errors["Accounts.Account Name"]} />
              </div>
            </div>

            {/* Mobile (dial-code picker + number) */}
            <div className="wf-row">
              <div className="wf-label">Mobile</div>
              <div
                className={fieldClass(
                  "wf-field wf-field-mandatory ux-pick-mixed multiple-fields-div flex-1-5",
                  "Contacts.Mobile"
                )}
              >
                <div className="wf-field-inner">
                  <div
                    ref={countryBoxRef}
                    id="phContacts___Mobile"
                    className={`multiselect wf-field-dropdown field-1 dropdown-with-search icon-with-text-dropdown single-select-drp${
                      dropdownOpen ? " dropbox-active" : ""
                    }`}
                  >
                    <div
                      className="selected-options hide-opt-list wf-field-item selected-options-field"
                      style={{ display: "none" }}
                    />
                    <div
                      className={`dropdown flex-center-v dropdown-contents${
                        dropdownOpen ? " open" : ""
                      }`}
                      onClick={() => {
                        clearError("Contacts.Mobile");
                        setDropdownOpen((o) => !o);
                        setSearch("");
                      }}
                    >
                      <span className="mR10 f22 content-display-area">
                        {selectedCountry.dial}
                      </span>
                      <ul
                        className={`dropdown-menu${dropdownOpen ? " dropdown-focus" : ""}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="text"
                          placeholder="Search"
                          className="dropdown-search-input"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                        <div className="dropdown-items-wrapper">
                          {filteredCountries.map((c) => (
                            <div
                              key={`${c.iso}-${c.ds}`}
                              className="option"
                              data-selected={c.iso === selectedCountry.iso ? "true" : "false"}
                              onClick={() => {
                                setCountryIso(c.iso);
                                setDropdownOpen(false);
                                setSearch("");
                              }}
                            >
                              <span className="icon-text-dropdown" data-value={countryRef(c)}>
                                <span style={{ marginRight: 10 }}>{c.ds}</span>
                                <span style={{ marginRight: 10 }}>{c.dial}</span>
                              </span>
                            </div>
                          ))}
                          {filteredCountries.length === 0 && (
                            <div className="option no-results">No options found</div>
                          )}
                        </div>
                      </ul>
                    </div>
                  </div>

                  <div className="field-2">
                    <div>
                      <input
                        ref={(el) => {
                          phoneRef.current = el;
                          fieldRefs.current["Contacts.Mobile"] = el;
                        }}
                        maxLength={30}
                        type="text"
                        inputMode="numeric"
                        className="wf-field-item wf-field-input"
                        onInput={() => clearError("Contacts.Mobile")}
                      />
                      <input
                        ref={dialCodeRef}
                        name="Contacts.Mobile"
                        maxLength={30}
                        type="text"
                        style={{ display: "none" }}
                        readOnly
                      />
                    </div>
                  </div>
                </div>
                <FieldError message={errors["Contacts.Mobile"]} />
              </div>
            </div>

            {/* Email */}
            <div className="wf-row">
              <div className="wf-label">Email</div>
              <div className={fieldClass("wf-field wf-field-mandatory", "Contacts.Email")}>
                <div className="wf-field-inner">
                  <input
                    ref={setRef("Contacts.Email")}
                    name="Contacts.Email"
                    maxLength={100}
                    type="text"
                    className="wf-field-item wf-field-input"
                    onInput={() => clearError("Contacts.Email")}
                  />
                </div>
                <FieldError message={errors["Contacts.Email"]} />
              </div>
            </div>

            {/* Service Interested In? */}
            <div className="wf-row">
              <div className="wf-label">Service Interested In?</div>
              <div className={fieldClass("wf-field wf-field-mandatory", "POTENTIALCF1")}>
                <div className="wf-field-inner dropdown-contents">
                  <select
                    ref={setRef("POTENTIALCF1")}
                    name="POTENTIALCF1"
                    className="wf-field-item wf-field-dropdown"
                    data-wform-field="select"
                    defaultValue="-None-"
                    onChange={() => clearError("POTENTIALCF1")}
                  >
                    <option value="-None-">-None-</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="SEO">SEO</option>
                    <option value="Website Development">Website Development</option>
                    <option value="Video Production">Video Production</option>
                    <option value="Influencer Marketing">Influencer Marketing</option>
                    <option value="AI Videos">AI Videos</option>
                  </select>
                </div>
                <FieldError message={errors["POTENTIALCF1"]} />
              </div>
            </div>

            {/* Monthly/Project Budget */}
            <div className="wf-row">
              <div className="wf-label">Monthly/Project Budget</div>
              <div className={fieldClass("wf-field", "POTENTIALCF3")}>
                <div className="wf-field-inner dropdown-contents">
                  <select
                    ref={setRef("POTENTIALCF3")}
                    name="POTENTIALCF3"
                    className="wf-field-item wf-field-dropdown"
                    data-wform-field="select"
                    defaultValue="-None-"
                    onChange={() => clearError("POTENTIALCF3")}
                  >
                    <option value="-None-">-None-</option>
                    <option value="Below ₹25K">Below ₹25K</option>
                    <option value="₹25K–₹50K">₹25K–₹50K</option>
                    <option value="₹50K–₹1L">₹50K–₹1L</option>
                    <option value="₹1L–₹3L">₹1L–₹3L</option>
                    <option value="₹3L+">₹3L+</option>
                  </select>
                </div>
                <FieldError message={errors["POTENTIALCF3"]} />
              </div>
            </div>

            {/* When do you want to start? */}
            <div className="wf-row">
              <div className="wf-label">When do you want to start?</div>
              <div className={fieldClass("wf-field wf-field-mandatory", "POTENTIALCF2")}>
                <div className="wf-field-inner dropdown-contents">
                  <select
                    ref={setRef("POTENTIALCF2")}
                    name="POTENTIALCF2"
                    className="wf-field-item wf-field-dropdown"
                    data-wform-field="select"
                    defaultValue="-None-"
                    onChange={() => clearError("POTENTIALCF2")}
                  >
                    <option value="-None-">-None-</option>
                    <option value="Immediately">Immediately</option>
                    <option value="Within 30 days">Within 30 days</option>
                    <option value="1–3 months">1–3 months</option>
                    <option value="Just Exploring">Just Exploring</option>
                  </select>
                </div>
                <FieldError message={errors["POTENTIALCF2"]} />
              </div>
            </div>

            {/* Tell Us About Your Requirement */}
            <div className="wf-row">
              <div className="wf-label">Tell Us About Your Requirement</div>
              <div className={fieldClass("wf-field wf-field-mandatory", "Description")}>
                <div className="wf-field-inner">
                  <textarea
                    ref={setRef("Description")}
                    name="Description"
                    maxLength={32000}
                    className="wf-field-item wf-field-input wf-text-area-input"
                    onInput={() => clearError("Description")}
                  />
                </div>
                <FieldError message={errors["Description"]} />
              </div>
            </div>

            {/* Lead Page URL – auto-filled from the current page URL */}
            <div className="wf-row" style={trackingRowStyle}>
              <div className="wf-label">Lead Page URL</div>
              <div className={fieldClass("wf-field", "POTENTIALCF4")}>
                <div className="wf-field-inner">
                  <input
                    ref={setRef("POTENTIALCF4")}
                    name="POTENTIALCF4"
                    maxLength={255}
                    type="text"
                    className="wf-field-item wf-field-input"
                    value={tracking.leadPageUrl}
                    onChange={(e) => {
                      clearError("POTENTIALCF4");
                      setTracking((t) => ({ ...t, leadPageUrl: e.target.value }));
                    }}
                  />
                </div>
                <FieldError message={errors["POTENTIALCF4"]} />
              </div>
            </div>

            {/* UTM Source – auto-filled from ?utm_source (or ad click id / referrer) */}
            <div className="wf-row" style={trackingRowStyle}>
              <div className="wf-label">UTM Source</div>
              <div className={fieldClass("wf-field", "POTENTIALCF5")}>
                <div className="wf-field-inner">
                  <input
                    ref={setRef("POTENTIALCF5")}
                    name="POTENTIALCF5"
                    maxLength={255}
                    type="text"
                    className="wf-field-item wf-field-input"
                    value={tracking.utmSource}
                    onChange={(e) => {
                      clearError("POTENTIALCF5");
                      setTracking((t) => ({ ...t, utmSource: e.target.value }));
                    }}
                  />
                </div>
                <FieldError message={errors["POTENTIALCF5"]} />
              </div>
            </div>

            {/* UTM Campaign – auto-filled from ?utm_campaign */}
            <div className="wf-row" style={trackingRowStyle}>
              <div className="wf-label">UTM Campaign</div>
              <div className={fieldClass("wf-field", "POTENTIALCF7")}>
                <div className="wf-field-inner">
                  <input
                    ref={setRef("POTENTIALCF7")}
                    name="POTENTIALCF7"
                    maxLength={255}
                    type="text"
                    className="wf-field-item wf-field-input"
                    value={tracking.utmCampaign}
                    onChange={(e) => {
                      clearError("POTENTIALCF7");
                      setTracking((t) => ({ ...t, utmCampaign: e.target.value }));
                    }}
                  />
                </div>
                <FieldError message={errors["POTENTIALCF7"]} />
              </div>
            </div>

            {/* UTM Content – auto-filled from ?utm_content */}
            <div className="wf-row" style={trackingRowStyle}>
              <div className="wf-label">UTM Content</div>
              <div className={fieldClass("wf-field", "POTENTIALCF6")}>
                <div className="wf-field-inner">
                  <input
                    ref={setRef("POTENTIALCF6")}
                    name="POTENTIALCF6"
                    maxLength={255}
                    type="text"
                    className="wf-field-item wf-field-input"
                    value={tracking.utmContent}
                    onChange={(e) => {
                      clearError("POTENTIALCF6");
                      setTracking((t) => ({ ...t, utmContent: e.target.value }));
                    }}
                  />
                </div>
                <FieldError message={errors["POTENTIALCF6"]} />
              </div>
            </div>

            {/* reCAPTCHA */}
            <div className="wf-row" data-ux-field-appearance="recaptcha">
              <div className="wf-label" />
              <div className={fieldClass("wf-field", "recaptcha")}>
                <div className="wf-field-inner">
                  <div
                    className="g-recaptcha"
                    id="recap7522188000000623170"
                    ref={(el) => {
                      recaptchaRef.current = el;
                      fieldRefs.current["recaptcha"] = el;
                    }}
                  />
                </div>
                <FieldError message={errors["recaptcha"]} />
              </div>
            </div>

            {/* Hidden: Sub-Pipeline */}
            <div className="wf-row" style={{ display: "none" }}>
              <div className="wf-label">Sub-Pipeline</div>
              <div className="wf-field wf-field-mandatory">
                <div className="wf-field-inner dropdown-contents">
                  <select
                    name="Pipeline"
                    className="wf-field-item wf-field-dropdown"
                    data-wform-field="select"
                    defaultValue="Sales Pipeline Standard"
                  >
                    <option value="Sales Pipeline Standard">Sales Pipeline Standard</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Hidden: Stage */}
            <div className="wf-row" style={{ display: "none" }}>
              <div className="wf-label">Stage</div>
              <div className="wf-field wf-field-mandatory">
                <div className="wf-field-inner dropdown-contents">
                  <select
                    name="Stage"
                    className="wf-field-item wf-field-dropdown"
                    data-wform-field="select"
                    defaultValue="Qualification"
                  >
                    <option value="Qualification">Qualification</option>
                    <option value="Needs Analysis">Needs Analysis</option>
                    <option value="Proposal/Price Quote">Proposal/Price Quote</option>
                    <option value="Negotiation/Review">Negotiation/Review</option>
                    <option value="Closed Won">Closed Won</option>
                    <option value="Closed Lost">Closed Lost</option>
                    <option value="Opportunity Identified">Opportunity Identified</option>
                    <option value="Discussed">Discussed</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Junk">Junk</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Hidden: Lead Source */}
            <div className="wf-row" style={{ display: "none" }}>
              <div className="wf-label">Lead Source</div>
              <div className="wf-field">
                <div className="wf-field-inner dropdown-contents">
                  <select
                    name="Lead Source"
                    className="wf-field-item wf-field-dropdown"
                    data-wform-field="select"
                    defaultValue="Official Website"
                  >
                    <option value="-None-">-None-</option>
                    <option value="Meta Ads">Meta Ads</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="WhatsApp Campaign">WhatsApp Campaign</option>
                    <option value="Advertisement">Advertisement</option>
                    <option value="Cold Call">Cold Call</option>
                    <option value="Employee Referral">Employee Referral</option>
                    <option value="External Referral">External Referral</option>
                    <option value="Online Store">Online Store</option>
                    <option value="Partner">Partner</option>
                    <option value="Public Relations">Public Relations</option>
                    <option value="Sales Email Alias">Sales Email Alias</option>
                    <option value="Seminar Partner">Seminar Partner</option>
                    <option value="Internal Seminar">Internal Seminar</option>
                    <option value="Trade Show">Trade Show</option>
                    <option value="Web Download">Web Download</option>
                    <option value="Web Research">Web Research</option>
                    <option value="Chat">Chat</option>
                    <option value="Official Website">Official Website</option>
                    <option value="WhatsApp Organic">WhatsApp Organic</option>
                    <option value="WHATSAPP - Mindstory Digital Partner">
                      WHATSAPP - Mindstory Digital Partner
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div className="wform-btn-wrap" data-ux-pos="left">
              <input
                id="formsubmit"
                type="submit"
                className="wf-btn"
                data-ux-btn-type="default"
                style={{
                  backgroundColor: "#1980d8",
                  color: "#fff",
                  border: "1px solid #1980d8",
                  width: "auto",
                }}
                value="Submit"
                disabled={submitting}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}