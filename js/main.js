//获取需要的dom元素
const doms = {
  audio: document.querySelector("audio"),
  ul: document.querySelector(".lrc-list"),
  container: document.querySelector(".container"),
};

/**
 * 解析歌词字符串
 * 得到一个歌词对象的数组
 * 每个歌词对象:{time:开始时间, words:歌词}
 */
function parseLrc(str) {
  const lines = str.split("\n");
  const lyricArr = [];
  lines.forEach((item) => {
    const time = item.slice(1, 9);
    const words = item.slice(10);
    lyricArr.push({
      time: parseTime(time),
      words,
    });
  });

  return lyricArr;
}
/**
 * 解析时间:将分钟*60转换位秒
 */
function parseTime(timeStr) {
  const [min, sec] = timeStr.split(":");
  return parseInt(min) * 60 + parseInt(sec);
}

const lrcData = parseLrc(lrc);

/**
 * 当前应该高亮显示的歌词的下标
 * 无歌词返回-1
 */
function findIndex() {
  const curTime = doms.audio.currentTime.toFixed(0);
  for (let i = 0; i < lrcData.length; i++) {
    if (curTime < lrcData[i].time) {
      return i - 1;
    }
  }
  return lrcData.length - 1;
}

/**
 * 创建歌词元素li
 */
function createLyric(words) {
  const frag = document.createDocumentFragment(); //文档片段--template
  words.forEach((item) => {
    const li = document.createElement("li");
    li.innerText = item.words;
    frag.appendChild(li);
  });
  doms.ul.appendChild(frag);
}
createLyric(lrcData);

//容器高度
const containerHeight = doms.container.clientHeight;
//歌词高度
const liHeight = doms.ul.children[0].clientHeight;
//歌词最大偏移量
const maxHeight = doms.ul.clientHeight - containerHeight;

function setOffset() {
  const index = findIndex();
  let offset = index * liHeight + liHeight / 2 - containerHeight / 2; //当前高亮歌词的顶部距离
  offset = offset < 0 ? 0 : offset > maxHeight ? maxHeight : offset; //边界处理
  doms.ul.style.transform = `translateY(-${offset}px)`; //设置偏移量
  doms.ul.querySelector(".active")?.classList.remove("active"); //移除高亮
  doms.ul.children[index]?.classList.add("active"); //高亮当前歌词
}

doms.audio.addEventListener("timeupdate", () => {
  setOffset();
});

//数据逻辑---界面逻辑---交互逻辑
