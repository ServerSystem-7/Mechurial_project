const db = require("./models/index");


const Page = db.page;
const Register = db.register;
const User = db.user;

db.sequelize.sync().then(() => {
    create_page();
    create_user();
    create_register();
}
);

create_page = () => Page.bulkCreate([
    {
        url: "https://ipsi.sungshin.ac.kr/guide/dataroom.htm?bbsid=notice&ctg_cd=all"
    },
    {
        url: "https://career.navercorp.com/naver/job/list/developer"
    },
    {
        url: "https://careers.kakao.com/jobs?part=TECHNOLOGY"
    }
])

create_user = () => User.bulkCreate([
    {
        id: "yujin11",
        password: "password11",
        email: "930yujin@gmail.com"
    },
    {
        id: "yujin22",
        password: "password22",
        email: "20200997sungshin.ac.kr"
    }
])

create_register = () => Register.bulkCreate([
    {
        url: "https://ipsi.sungshin.ac.kr/guide/dataroom.htm?bbsid=notice&ctg_cd=all",
        key1: "외국인",
        key2: "안녕",
        key3: "잘가",
        notifyLogic: "or",
        siteName: "성신입학",
        dueDate: '2022-06-12',
        dueTime: '11:00:00',
        userId: "yujin11",
    },
    {
        url: "https://ipsi.sungshin.ac.kr/guide/dataroom.htm?bbsid=notice&ctg_cd=all",
        key1: "외국인",
        key2: "안녕",
        key3: "잘가",
        notifyLogic: "and",
        siteName: "성신입학",
        dueDate: '2022-06-12',
        dueTime: '11:00:00',
        userId: "yujin22",
    },
    {
        url: "https://ipsi.sungshin.ac.kr/guide/dataroom.htm?bbsid=notice&ctg_cd=all",
        key1: "외국인",
        key2: "안녕",
        key3: "잘가",
        notifyLogic: "and",
        siteName: "성신입학",
        dueDate: '2022-06-12',
        dueTime: '11:00:00',
        userId: "yujin11",
    },
    {
        url: "https://career.navercorp.com/naver/job/list/developer",
        key1: "데이터",
        key2: "분석",
        key3: "파이낸셜",
        notifyLogic: "and",
        siteName: "네이버개발채용",
        dueDate: '2022-06-12',
        dueTime: '11:00:00',
        userId: "yujin22",
    },
    {
        url: "https://careers.kakao.com/jobs?part=TECHNOLOGY",
        key1: "가가가가",
        key2: "나나나나",
        key3: "다다다다",
        notifyLogic: "or",
        siteName: "카카오테크채용",
        dueDate: '2022-06-12',
        dueTime: '11:00:00',
        userId: "yujin22",
    },
    {
        url: "https://careers.kakao.com/jobs?part=TECHNOLOGY",
        key1: "가가가가",
        key2: "나나나나",
        key3: "다다다다",
        notifyLogic: "or",
        siteName: "카카오테크채용",
        dueDate: '2022-06-12',
        dueTime: '11:00:00',
        userId: "yujin22",
    }
])