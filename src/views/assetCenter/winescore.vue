<template>
  <div class="container jiupi-center">
    <iframe :src="src" width="420" height="680"></iframe>
  </div>
</template>

<script>
import * as assetsCenter from "@/api/assetsCenter/assetsCenter";

export default {
    name: "winescore",
    data() {
        return {
            src: '',
        }
    },
    created() {
        this.getSettingValue();
    },
    methods: {
        getSettingValue() {
            assetsCenter.GetUserInfo({})
                .then(data => {
                    this.src = data.data.lotteryUrl
                })
        }
    }
}
</script>

<style scoped>

</style>
