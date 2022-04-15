import 'zone.js'; // Included with Angular CLI.

import { environment } from './environments/environment';

if (environment.production) {
    if(!window.console) {
        var console = {
         log : function(){},
         warn : function(){},
         error : function(){},
         time : function(){},
         timeEnd : function(){}
        }
       }
} else {
  
}