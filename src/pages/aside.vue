<template>
  <aside class="task-details">
    <div class="tag-progress">
      <h2>Task Progress</h2>
      <div class="tag-progress">
        <p>Copywriting <span>3/8</span></p>
        <progress class="progress progress--copyright" max="8" value="3">
          3
        </progress>
      </div>
      <div class="tag-progress">
        <p>Illustration <span>6/10</span></p>
        <progress class="progress progress--illustration" max="10" value="6">
          6
        </progress>
      </div>
      <div class="tag-progress">
        <p>UI Design <span>2/7</span></p>
        <progress class="progress progress--design" max="7" value="2">
          2
        </progress>
      </div>
    </div>
    <div class="task-activity">
      <h2>Recent Activity</h2>
      <ul>
        <li>
          <span class="task-icon task-icon--attachment"
            ><i class="fas fa-paperclip"></i
          ></span>
          <b>Andrea </b>uploaded 3 documents
          <time datetime="2021-11-24T20:00:00">Aug 10</time>
        </li>
        <li>
          <span class="task-icon task-icon--comment"
            ><i class="fas fa-comment"></i
          ></span>
          <b>Karen </b> left a comment
          <time datetime="2021-11-24T20:00:00">Aug 10</time>
        </li>
        <li>
          <span class="task-icon task-icon--edit"
            ><i class="fas fa-pencil-alt"></i
          ></span>
          <b>Karen </b>uploaded 3 documents
          <time datetime="2021-11-24T20:00:00">Aug 11</time>
        </li>
        <li>
          <span class="task-icon task-icon--attachment"
            ><i class="fas fa-paperclip"></i
          ></span>
          <b>Andrea </b>uploaded 3 documents
          <time datetime="2021-11-24T20:00:00">Aug 11</time>
        </li>
        <li>
          <span class="task-icon task-icon--comment"
            ><i class="fas fa-comment"></i
          ></span>
          <b>Karen </b> left a comment
          <time datetime="2021-11-24T20:00:00">Aug 12</time>
        </li>
      </ul>
    </div>
  </aside>
</template>

<script setup>
import 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.2/js/all.min.js'



</script>

<style lang="scss" scoped>
@mixin display {
    display: flex;
    align-items: center;
}

.task-details {
  width: 24%;
  border-left: 1px solid #d9e0e9;
  display: inline-block;
  height: 100%;
  vertical-align: top;
  padding: 3rem 2rem;
}

.tag-progress {
  margin: 1.5rem 0;

  h2 {
    font-size: 16px;
    margin-bottom: 1rem;
  }

  p {
    display: flex;
    width: 100%;
    justify-content: space-between;

    span {
      color: rgb(180, 180, 180);
    }
  }

  .progress {
    width: 100%;
    -webkit-appearance: none;
    appearance: none;
    border: none;
    border-radius: 10px;
    height: 10px;

    &::-webkit-progress-bar,
    &::-webkit-progress-value {
      border-radius: 10px;
    }

    &--copyright {
      &::-webkit-progress-bar {
        background-color: #ecd8e6;
      }

      &::-webkit-progress-value {
        background: #d459e8;
      }
    }

    &--illustration {
      &::-webkit-progress-bar {
        background-color: #dee7e3;
      }

      &::-webkit-progress-value {
        background-color: #46bd84;
      }
    }

    &--design {
      &::-webkit-progress-bar {
        background-color: #d8e7f4;
      }

      &::-webkit-progress-value {
        background-color: #08a0f7;
      }
    }
  }
}

.task-activity {
  h2 {
    font-size: 16px;
    margin-bottom: 1rem;
  }

  li {
    list-style: none;
    margin: 1rem 0;
    padding: 0rem 1rem 1rem 3rem;
    position: relative;
  }

  time {
    display: block;
    color: #c4cad3;
  }
}

.task-icon {
  width: 30px;
  height: 30px;
  border-radius: 100rem;
  position: absolute;
  top: 0;
  left: 0;
  @include display;
  justify-content: center;

  svg {
    font-size: 12px;
    color: #fff;
  }

  &--attachment {
    background-color: #fba63c;
  }

  &--comment {
    background-color: #5dc983;
  }

  &--edit {
    background-color: #7784ee;
  }
}

@media only screen and (max-width: 1300px) {
  .project {
    max-width: 100%;
  }

  .task-details {
    width: 100%;
    display: flex;
  }

  .tag-progress,
  .task-activity {
    flex-basis: 50%;
    background: #fff;
    padding: 1rem;
    border-radius: 8px;
    margin: 1rem;
  }
}

@media only screen and (max-width: 1000px) {
  .project-column:nth-child(2),
  .project-column:nth-child(3) {
    display: none;
  }

  .project-tasks {
    grid-template-columns: 1fr 1fr;
  }
}

@media only screen and (max-width: 600px) {
  .project-column:nth-child(4) {
    display: none;
  }

  .project-tasks {
    grid-template-columns: 1fr;
  }

  .task-details {
    flex-wrap: wrap;
    padding: 3rem 1rem;
  }

  .tag-progress,
  .task-activity {
    flex-basis: 100%;
  }

  h1 {
    font-size: 25px;
  }
}
</style>