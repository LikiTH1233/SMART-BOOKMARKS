"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.supabase = void 0;

var _supabaseJs = require("@supabase/supabase-js");

var supabase = (0, _supabaseJs.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
exports.supabase = supabase;
//# sourceMappingURL=supabaseClient.dev.js.map
