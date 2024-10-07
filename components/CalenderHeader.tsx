import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, PanResponder, Animated, Dimensions } from 'react-native';
import { colors } from '../styles/color';

const { width } = Dimensions.get('window');
const itemWidth = width / 7; // 每个日期的宽度

export default function MinimalCalendar() {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const pan = useRef(new Animated.Value(0)).current;

  // 创建 PanResponder
  const panResponder = useRef(
    PanResponder.create({
      // 询问是否成为响应者
      onStartShouldSetPanResponder: () => true,
      // 处理手势移动
      onPanResponderMove: Animated.event(
        [null, { dx: pan }],
        { useNativeDriver: false }
      ),
      // 手势释放后
      onPanResponderRelease: (evt, gestureState) => {
        handlePanResponderEnd(gestureState);
      },
    })
  ).current;

  useEffect(() => {
    updateDates(new Date());
  }, []);

  // 更新日期数组，围绕 selectedDate 前后三天
  const updateDates = (centerDate) => {
    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const date = new Date(centerDate);
      date.setDate(centerDate.getDate() + i - 3);
      return date;
    });
    setDates(weekDates);
  };

  // 处理拖拽结束
  const handlePanResponderEnd = (gestureState) => {
    const { dx } = gestureState;
    const threshold = itemWidth / 2; // 触发日期改变的最小距离

    let dateChange = 0;
    if (dx > threshold) {
      dateChange = -1;
    } else if (dx < -threshold) {
      dateChange = 1;
    }

    if (dateChange !== 0) {
      const newSelectedDate = new Date(selectedDate);
      newSelectedDate.setDate(selectedDate.getDate() + dateChange);

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (newSelectedDate <= today) {
        setSelectedDate(newSelectedDate);
        updateDates(newSelectedDate);
      }
    }

    // 复位动画
    Animated.spring(pan, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
  };

  // 判断日期是否可选择（不超过今天）
  const isDateSelectable = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date <= today;
  };

  // 根据时间段显示不同的问候语
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      return '早上好';
    } else if (currentHour < 18) {
      return '下午好';
    } else {
      return '晚上好';
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.dateContainer, { transform: [{ translateX: pan }] }]}
        {...panResponder.panHandlers}
      >
        {dates.map((date, index) => {
          const isSelected = selectedDate.toDateString() === date.toDateString();
          const selectable = isDateSelectable(date);

          return (
            <TouchableOpacity
              key={index}
              style={styles.itemContainer}
              disabled={!selectable}
              onPress={() => {
                if (selectable) {
                  setSelectedDate(date);
                  updateDates(date);
                }
              }}
            >
              <Text style={styles.dayName}>{['日', '一', '二', '三', '四', '五', '六'][date.getDay()]}</Text>
              <View
                style={[
                  styles.dateButton,
                  isSelected && styles.selectedButton,
                  !selectable && styles.futureButton,
                ]}
              >
                <Text
                  style={[
                    styles.dateText,
                    isSelected && styles.selectedText,
                    !selectable && styles.futureText,
                  ]}
                >
                  {date.getDate()}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </Animated.View>

      {/* 新增的左右布局容器 */}
      <View style={styles.footer}>
        <View style={styles.leftContainer}>
          <Text style={styles.currentDateText}>
            {`${selectedDate.getFullYear()}年${selectedDate.getMonth() + 1}月${selectedDate.getDate()}日`}
          </Text>
          <Text style={styles.greetingText}>{getGreeting()}</Text>
        </View>
        <View style={styles.rightContainer}>
          {/* 右侧内容暂时留空 */}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
  },
  itemContainer: {
    width: itemWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textGray600,
  },
  dateButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    marginTop: 4,
  },
  selectedButton: {
    backgroundColor: colors.primary,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textGray600,
  },
  selectedText: {
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  futureButton: {
    backgroundColor: 'transparent',
  },
  futureText: {
    color: colors.gray400,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // 左右分布
    marginTop: 16,
    paddingHorizontal: 16, // 添加左右内边距
  },
  leftContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  currentDateText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gray600,
  },
  greetingText: {
    fontSize: 16,
    color: colors.gray600,
    marginTop: 4,
  },
  rightContainer: {
    // 右侧内容暂时为空，可以在这里添加组件
  },
});
