import { ref,reactive } from "vue";

export default function(){
    let dialogFormVisible = ref(false);
    const formLabelWidth = '140px'

    const form = reactive({
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: '',
    })

    let openUser = function(){
        dialogFormVisible.value = true;
    }

    return {
        form,
        openUser
    }

}