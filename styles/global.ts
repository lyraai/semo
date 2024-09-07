import { StyleSheet } from 'react-native';
import { colors } from './color';
import { typography } from './typography';

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  heading1: typography.heading1,
  heading2: typography.heading2,
  bodyText: typography.bodyText,
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: typography.buttonText,
  input: {
    borderColor: colors.border,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
});