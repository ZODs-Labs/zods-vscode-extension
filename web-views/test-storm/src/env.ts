const windowAny = window as any;

if (!windowAny['zods']) {
   windowAny['zods'] = {};
}

export const ENV = {
   IS_DEV: !windowAny['zods']['IS_PROD'],
   ApiUrl: windowAny['zods']['ApiUrl'] || 'http://localhost:5002/api',
   WebUrl: windowAny['zods']['WebUrl'] || 'http://localhost:3000',
   AITestStormIconUrl:
      windowAny['zods']['AITestStormIconUrl'] ||
      'http://localhost:3000/icons/ai-test-storm.svg',
   RawLogoUrl:
      windowAny['zods']['RawLogoUrl'] ||
      'http://localhost:3000/contrast-logo.png',
   TestIconUrl:
      windowAny['zods']['TestIconUrl'] ||
      'http://localhost:3000/icons/test-icon.svg',
   StormIconUrl:
      windowAny['zods']['StormIconUrl'] ||
      'http://localhost:3000/icons/storm-icon.svg',
   // GooglePalmLogoUrl:
   //    windowAny['zods']['GooglePalmLogoUrl'] ||
   //    'http://localhost:3000/google_palm_logo.png',
   // CodeIconUrl:
   //    windowAny['zods']['CodeIconUrl'] ||
   //    'http://localhost:3000/icons/code-icon.svg',
   // TrashIconUrl:
   //    windowAny['zods']['TrashIconUrl'] ||
   //    'http://localhost:3000/icons/trash-icon.svg',
   // SendIconUrl:
   //    windowAny['zods']['SendIconUrl'] ||
   //    'http://localhost:3000/icons/send-icon.svg',
   // BugIconUrl:
   //    windowAny['zods']['BugIconUrl'] ||
   //    'http://localhost:3000/icons/bug-icon.svg',
   // BulbIconUrl:
   //    windowAny['zods']['BulbIconUrl'] ||
   //    'http://localhost:3000/icons/bulb-icon.svg',
   // StopCircleIconUrl:
   //    windowAny['zods']['StopCircleIconUrl'] ||
   //    'http://localhost:3000/icons/stop-circle-icon.svg',
   // MistralAILogoUrl:
   //    windowAny['zods']['MistralAILogoUrl'] ||
   //    'http://localhost:3000/mistralai_logo.png',
};
