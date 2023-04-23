<script setup></script>

<template>
  <div
    class="fixed inset-0 z-50 flex flex-col items-center justify-center h-screen bg-black register-comp bg-opacity-70"
  >
    <form class="register-form bg-white rounded border p-4 w-[400px]">
      <h1 class="mb-5 text-2xl font-bold text-center form-title">Register</h1>
      <div class="form-groups">
        <div class="mt-3 group">
          <div
            class="flex flex-row items-center space-x-6 buttons justify-evenly"
          >
            <button class="another-options my-1 w-[40px] py-2">
              <img
                class="w-full"
                src="../assets/icons/google.png"
                alt="google"
              />
            </button>
            <button class="another-options my-1 w-[40px] py-2">
              <img
                src="../assets/icons/vk.png"
                class="w-full"
                alt="vkkontakte"
              />
            </button>
            <button class="another-options my-1 w-[40px] py-2">
              <img
                src="../assets/icons/yandex.png"
                class="w-full"
                alt="vkkontakte"
              />
            </button>
          </div>
        </div>
      </div>
    </form>
    <div class="my-4 text-center text-white texts">
      <p>Я подтверждаю, что мне уже исполнилось 18 лет.</p>
      <p>
        Я принимаю <a class="underline" href="#">Пользовательское соглашение</a>
      </p>
    </div>
  </div>
</template>
