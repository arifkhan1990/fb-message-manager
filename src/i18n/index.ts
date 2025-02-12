import i18next, { InitOptions } from 'i18next';

// Define supported languages and their translations
const resources = {
  en: {
    translation: {
      'Chat Manager': 'Chat Manager',
      'Select Chats': 'Select Chats',
      'Cancel Selection': 'Cancel Selection',
      'Select All': 'Select All',
      'Archive Selected': 'Archive Selected',
      'Delete Selected': 'Delete Selected',
      'Available Chats': 'Available Chats',
      'Close Sidebar': 'Close Sidebar',
      'Wrong Page': 'Wrong Page',
      'Please navigate to Facebook Messages': 'Please navigate to Facebook Messages to use this extension.',
      'Go to Messages': 'Go to Messages',
      'Confirm archive': 'Confirm Archive',
      'Confirm delete': 'Confirm Delete',
      'Are you sure you want to archive': 'Are you sure you want to archive {{count}} chat(s)?',
      'Are you sure you want to delete': 'Are you sure you want to delete {{count}} chat(s)?',
      'Cancel': 'Cancel',
      'Confirm': 'Confirm',
      'Archiving chats...': 'Archiving chats...',
      'Deleting chats...': 'Deleting chats...',
      'Successfully archived': 'Successfully archived {{count}} chat(s)',
      'Successfully deleted': 'Successfully deleted {{count}} chat(s)',
      'Failed to initialize': 'Failed to initialize. Please try refreshing the page.',
      'Failed to archive': 'Failed to archive chats. Please try again.',
      'Failed to delete': 'Failed to delete chats. Please try again.',
      'Please select chats': 'Please select at least one chat first',
    }
  },
  bn: {
    translation: {
      'Chat Manager': 'চ্যাট ম্যানেজার',
      'Select Chats': 'চ্যাট নির্বাচন করুন',
      'Cancel Selection': 'নির্বাচন বাতিল করুন',
      'Select All': 'সব নির্বাচন করুন',
      'Archive Selected': 'নির্বাচিত সংরক্ষণ করুন',
      'Delete Selected': 'নির্বাচিত মুছুন',
      'Available Chats': 'উপলব্ধ চ্যাটসমূহ',
      'Close Sidebar': 'সাইডবার বন্ধ করুন',
      'Wrong Page': 'ভুল পৃষ্ঠা',
      'Please navigate to Facebook Messages': 'এই এক্সটেনশনটি ব্যবহার করতে অনুগ্রহ করে ফেসবুক মেসেজে যান।',
      'Go to Messages': 'মেসেজে যান',
      'Confirm archive': 'সংরক্ষণ নিশ্চিত করুন',
      'Confirm delete': 'মুছা নিশ্চিত করুন',
      'Are you sure you want to archive': 'আপনি কি নিশ্চিত যে আপনি {{count}} চ্যাট সংরক্ষণ করতে চান?',
      'Are you sure you want to delete': 'আপনি কি নিশ্চিত যে আপনি {{count}} চ্যাট মুছতে চান?',
      'Cancel': 'বাতিল',
      'Confirm': 'নিশ্চিত করুন',
      'Archiving chats...': 'চ্যাট সংরক্ষণ করা হচ্ছে...',
      'Deleting chats...': 'চ্যাট মুছে ফেলা হচ্ছে...',
      'Successfully archived': 'সফলভাবে {{count}} চ্যাট সংরক্ষণ করা হয়েছে',
      'Successfully deleted': 'সফলভাবে {{count}} চ্যাট মুছে ফেলা হয়েছে',
      'Failed to initialize': 'প্রারম্ভিককরণ ব্যর্থ হয়েছে। অনুগ্রহ করে পৃষ্ঠাটি রিফ্রেশ করুন।',
      'Failed to archive': 'চ্যাট সংরক্ষণ ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
      'Failed to delete': 'চ্যাট মুছে ফেলা ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।',
      'Please select chats': 'অনুগ্রহ করে অন্তত একটি চ্যাট নির্বাচন করুন',
    }
  }
};

// Create a new instance
const i18n = i18next.createInstance();

// Initialize synchronously
i18n.init({
  resources,
  lng: 'en', // Default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  },
  initImmediate: false
});

export { i18n };
