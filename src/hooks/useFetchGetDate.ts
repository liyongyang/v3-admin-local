import { ref, computed } from "vue"
import dayjs from "dayjs"

export function useFetchGetDate() {
  const dateFormat = {
    type1: "YYYY.MM.DD",
    type2: "YYYY-MM-DD",
    type3: "YYYY-MM-DD HH:mm:ss"
  }
  const today = dayjs().format(dateFormat.type1)
  const defaultTime = [dayjs().add(-6, "days"), dayjs()]
  const shortcuts = [
    {
      text: "最近一周",
      value: [dayjs().add(-6, "d"), dayjs()]
    },
    {
      text: "最近一个月",
      value: [dayjs().add(-14, "d"), dayjs()]
    },
    {
      text: "最近3个月",
      value: [dayjs().add(-29, "d"), dayjs()]
    }
  ]
  const pickDate = ref("")
  const getPickDate = computed(() => {
    return (
      (pickDate.value && [
        dayjs(pickDate.value[0]).format(dateFormat.type3),
        dayjs(pickDate.value[1]).format(dateFormat.type3)
      ]) ||
      []
    )
  })
  return { today, defaultTime, shortcuts, dateFormat, pickDate, getPickDate }
}
