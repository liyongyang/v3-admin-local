<template>
  <div h-full uno-padding-20>
    <div h-full text-center flex select-none all:transition-400>
      <div ma>
        <div text-5xl fw100 animate-bounce-alt animate-count-infinite animate-1s>CSS 动效</div>
        <div op30 dark:op60 text-lg fw300 m1>text 文本类信息处理</div>
        <div m2 flex justify-center text-lg op30 dark:op60 hover="op80" dark:hover="op80">
          <p>hover</p>
        </div>
      </div>
    </div>
    <div absolute bottom-5 right-0 left-0 text-center op30 dark:op60 fw300>
      该页面是一个 UnoCSS 的使用案例，其他页面依旧采用 Scss
    </div>
  </div>
</template>
