<template>
  <div>
    <div class="TagVue">
      <!-- 左箭头 -->
      <!-- <div
        class="arrow arrow_left"
        v-show="arrowVisible"
        @click="handleClickToLeft"
      >
        <el-icon :size="20"><ArrowLeft /></el-icon>
      </div> -->
      <el-scrollbar style="height: 60px; white-space: nowrap" ref="elscrollbar">
      <!-- 标签内容 -->
      <div class="tags_content" ref="box">
        <span class="tags_style" ref="tags">
          <!-- tag方法：  -->
          <el-tag
            v-for="(tag, index) in tags"
            :key="tag.name"
            :class="[active == index ? 'active top_tags' : 'top_tags']"
            
            :closable="tag.name != '首页'"
            @close="handleClose(index, tag)"
            @click="clickTag(index, tag)"
            @contextmenu.prevent="handleClickContextMenu(index, tag)"
          >
            {{ tag.name }}
          </el-tag>
        </span>
      </div>
      </el-scrollbar>
      <!-- 右箭头 -->
      <!-- <div
        class="arrow arrow_right"
        v-show="arrowVisible"
        @click="handleClickToRight"
      >
        <el-icon :size="20"><ArrowRight /></el-icon>
      </div> -->
    </div>
    <!-- 右键菜单 -->
    <ul
      v-show="contextMenu.isShow"
      :style="{ left: contextMenu.menuLeft, top: '96px' }"
      class="el-dropdown-menu el-popper"
      x-placement="bottom-end"
    >
      <li
        v-if="this.active == this.contextMenu.index"
        class="el-dropdown-menu__item"
        @click="refresh"
      >
        刷新
      </li>
      <li class="el-dropdown-menu__item" @click="closeRightTag">关闭右侧</li>
      <li class="el-dropdown-menu__item" @click="closeOtherTag">关闭其它</li>
      <div x-arrow="" class="popper__arrow" style="left: 44px"></div>
    </ul>
  </div>
</template>
<script >
export default {
  data() {
    return {
      // 是否有箭头
      arrowVisible: true,
      // 点击次数
      num: 0,
      active: 0,
      tags: [{ name: "首页", path: "/home"}],
      // 右键的元素
      contextMenu: {
        index: 0,
        tag: {},
        menuLeft: 0,
        isShow: false,
      },
    };
  },
  watch: {
    $route() {
      this.getThisPage();
    },
  },
  mounted() {
    var that = this;
    document.addEventListener("click", function () {
      that.contextMenu.isShow = false;
    });
  },
  methods: {
    // 判断当前页
    getThisPage() {
      let currentPgae = this.$route;
      // 判断tags里是否有当前页面
      var index = this.tags.findIndex((tag) => tag.name == currentPgae.name);
      if (index == -1 && currentPgae.name) {
        this.tags.push({
          name: currentPgae.name,
          path: currentPgae.path,
        });
      }
      // 当前选择页
      this.active = this.tags.findIndex((tag) => tag.name == currentPgae.name);
    },
    // 关闭标签
    handleClose(index, tag) {
      this.tags.splice(this.tags.indexOf(tag), 1);
      if (index == this.tags.length) {
        this.active = index - 1;
        this.$router.push(this.tags[index - 1].path);
      } else {
        this.$router.push(this.tags[index].path);
      }
    },
    // 点击标签
    clickTag(index, tag) {
      this.active = index;
      this.$router.push(tag.path);
    },
    // 左侧按钮
    // handleClickToLeft() {
    //   if (this.num > 0) {
    //     this.num--;
    //     this.$refs.box.style.transform = `TranslateX(-${this.num * 200}px)`;
    //   }
    // },
    // // 右侧按钮
    // handleClickToRight() {
    //   // 最后一个标签右测距离浏览器左侧距离
    //   let lastChild = document
    //     .querySelectorAll(".top_tags")
    //     [this.tags.length - 1].getBoundingClientRect().right;
    //   // 可视窗口的宽
    //   let bodyWidth = document.body.offsetWidth;
    //   // 右侧箭头48+右侧边距16
    //   if (bodyWidth - lastChild <= 64) {
    //     this.num++;
    //     this.$refs.box.style.transform = `TranslateX(-${this.num * 200}px)`;
    //   }
    // },
    // 右键
    handleClickContextMenu(index, tag) {
      this.contextMenu.isShow = true;
      this.contextMenu.index = index;
      this.contextMenu.tag = tag;
      let isTag = document
        .querySelectorAll(".top_tags")
        [index].getBoundingClientRect();
      this.contextMenu.menuLeft = isTag.left - 48 + isTag.width / 2 + "px";
    },
    // 刷新
    refresh() {
      this.$router.go(0);
    },
    // 关闭其他
    closeOtherTag() {
      let tagsLin = this.tags.length,
        { index, tag, menuLeft } = this.contextMenu;
      if (index != 0) {
        this.tags = [
          {
            name: "首页",
            path: "/home",
          },
          {
            name: tag.name,
            path: tag.path,
          },
        ];
      } else {
        this.tags = [
          {
            name: "首页",
            path: "/home",
          },
        ];
      }
      this.active = index;
      this.$router.push(tag.path);
    },
    // 关闭右侧
    closeRightTag() {
      let tagsLin = this.tags.length,
        { index, tag, menuLeft } = this.contextMenu;
      this.tags.splice(index + 1, tagsLin - index);
      this.active = index;
      this.$router.push(tag.path);
    },
  },
  created() {
    // 监听页面刷新
    window.addEventListener("beforeunload", (e) => {
      localStorage.setItem(
        "tagInfo",
        JSON.stringify({
          active: this.active,
          tags: this.tags,
        })
      );
    });
    let tagInfo = localStorage.getItem("tagInfo")
      ? JSON.parse(localStorage.getItem("tagInfo"))
      : {
          active: 0,
          tags: [
            {
              name: "首页",
              path: "/home",
            },
          ],
        };
    this.active = tagInfo.active;
    this.tags = tagInfo.tags;
  },
};
</script>
<style lang="less" scoped>
.tags {
  position: relative;
  overflow: hidden;
  .arrow {
    width: 48px;
    text-align: center;
    cursor: pointer;
    background: #fff;
    position: absolute;
    z-index: 1;
    &_left {
        line-height: 48px;
        left: 16px;
        border: 1px solid;
        text-align: center;
        top: 0;
    }
    &_right {
      right: 0;
      top: 0;
    }
  }
  &_content {
    transition: 0.3s;
    white-space: nowrap;
    line-height: 48px;
    margin: 0 8px;
    ::v-deep .el-tag {
      cursor: pointer;
      margin: 0 8px;
    }
  }

  .top_tags {
    margin-right: 8px;
    cursor: pointer;
    background: #fff;
    font-size: 12px;
    font-weight: 400;
    color: #1d2129;
  }
  .top_tags:hover,
  .active,
  .el-tag__content:hover {
    background: #e7eaf0;
  }
  // .active{
  //    background: #999;
  // }
}
.TagVue {
  height: 48px;
  width: 100%;
  background-color: #ffff;
  margin-top: 16px;
  position: relative;
  .active {
     background: #e7eaf0;
  }
  .arrow .arrow_left {
    width: 36px;
    line-height: 48px;
    position: absolute;
    left: 16px;
    border: 1px solid;
    text-align: center;
  }
}
</style>