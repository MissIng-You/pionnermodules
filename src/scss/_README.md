> # "styles"文件夹说明：


* >## "bootstrap"文件夹里面存放"bootstrap公用样式" --> 一般不需要每个开发人员处理，由统一人员维护


* >## "extension"文件夹里面存放"扩展或者重写的bootstrap样式" --> 一般不需要每个开发人员处理，由统一人员维护


* >## "thirdpart"文件夹里面存放第三方重置样式（eg：arcgis重置样式， select2控件重置样式 etc.）


* >## "widgets"文件夹里面存放项目中组件（注：不一定是整个页面）样式（eg：login页面样式，CRUD页面样式）


* >## "iconfont"文件夹里面存放项目中所有自定义字体文件。
* ># 注："_iconfont_download.scss"文件就是从阿里iconfont网站上下载下来的iconfont.css文件


* >## "bootstrap.scss","extension.scss","iconfont.scss", "thirdpart.scss","widget.scss"为以上五个文件夹所有样式的糅合。


> # 注意事项：

* >### 所有样式都用“scss”预编译语言书写，在写“scss”有可能会使用到一些通用的方法， 请参考“bootstrap”文件夹下的“_mixins.scss”（即："bootstrap/mixins"文件夹下所有的"mixins"方法）

* >### 文件命名方式：英文下划线 + 名称 + ".scss", (eg： _select.scss)


> # 所有样式重置规范，遵循（BEM规范）/块（block）,元素（element）,修饰符（modifier）：

https://github.com/weixin/tmt-workflow/wiki/%E2%92%9B-%5B%E8%A7%84%E8%8C%83%5D--CSS-BEM-%E4%B9%A6%E5%86%99%E8%A7%84%E8%8C%83
在选择器中，由以下三种符合来表示扩展的关系：

-   中划线 ：仅作为连字符使用，表示某个块或者某个子元素的多单词之间的连接记号。
__  双下划线：双下划线用来连接块和块的子元素
_   单下划线：单下划线用来描述一个块或者块的子元素的一种状态

type-block__element_modifier

.component-name{} //模块名
.component-name--modifier-name{}  //模块名--修饰符
.component-name__sub-object{}  //模块名__元素名
.component-name__sub-object--modifier-name{}  //模块名__元素名--修饰符