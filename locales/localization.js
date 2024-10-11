import { Platform, NativeModules } from 'react-native';
import translations from './translations';

// 获取设备的当前语言
const deviceLanguage =
  Platform.OS === 'ios'
    ? NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13+ 的兼容性处理
    : NativeModules.I18nManager.localeIdentifier;

// 提取语言代码部分（例如 en_US -> en）
export const languageCode = deviceLanguage.split('_')[0] || 'en'; // 默认英语

export const translate = (key) => {
  return translations[languageCode][key] || key;
};
