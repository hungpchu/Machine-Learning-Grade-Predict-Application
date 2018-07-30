"use strict"
var Module = {
    preRun: (function() {
        console.log("prerun");
        console.log("MpFS in mplib");
        console.log('voiceFiles trong mplib = ', voiceFiles);
        // console.log(MpFS.prepareResource());
        MpFS.prepareResource();
    }),
    postRun: (function() {
        $.mpwebgl.instance.init_mp_param();
    }),
    print: (function() {
        var element = $('#output')[0];
        if (element) element.value = ''; // clear browser cache
        return function(text) {
          text = Array.prototype.slice.call(arguments).join(' ');
          console.log(text);
          if (element) {
            element.value += text + "\n";
            element.scrollTop = element.scrollHeight; // focus on bottom
          }
        };
    })(),
    printErr: function(text) {
        text = Array.prototype.slice.call(arguments).join(' ');
        if (0) { // XXX disabled for safety typeof dump == 'function') {
          dump(text + '\n'); // fast, straight to the real console
        } else {
          console.error(text);
        }
    },
    canvas: null,
    setStatus: function(text) {
        if (!Module.setStatus.last) Module.setStatus.last = { time: Date.now(), text: '' };
            if (text === Module.setStatus.text) return;
            var m = text.match(/([^(]+)\((\d+(\.\d+)?)\/(\d+)\)/);
            var now = Date.now();
            var progressElement = $('#progress')[0], 
                statusElement = $('#status')[0];
            if (m && now - Date.now() < 30) return; // if this is a progress update, skip it if too soon
            if (m) {
              text = m[1];
              progressElement.value = parseInt(m[2])*100;
              progressElement.max = parseInt(m[4])*100;
              $(progressElement).hide();
            } else {
              progressElement.value = null;
              progressElement.max = null;
              progressElement.hidden = true;
            }
            $(statusElement).html(text);
    },
    totalDependencies: 0,
    monitorRunDependencies: function(left) {
        this.totalDependencies = Math.max(this.totalDependencies, left);
        Module.setStatus(left ? 'Preparing... (' + (this.totalDependencies-left) + '/' + this.totalDependencies + ')' : 'All downloads complete.');
    }
};
(function(factory) {
    factory(window.jQuery);
}(function($) {
    var mpwebgl, mpwgl = function() {};
    var mpFace_, mpRender_, mpCtlAnim_, mpCtlHair_, mpCtlBeard_, mpCtlGlasses_, mpVoice_, mpCosme_, mpAnim_;
    var mpFaceId_, mpHairId_, mpBeardId_, mpGlassesId_, mpExpressionId_, mpCosmeLipId_, mpCosmeCheekId_, mpCosmeEyeId_, mpVoiceId_;
    var audio_, animAudio_;
    var CosmeType = {
        LIP     : 0,
        EYE     : 1,
        CHEEK   : 2,
        ALL     : 3
    }
    var animStartTime_ = 0,
        lastTime_ = 0,
        startTime_ = 0,
        num_counter_ = 0,
        mess_, iscomplete_ = false;
    var dw_ = 400,
        dh_ = 400,
        bgdraw = false,
        agingMaskY_ = 0,
        agingMaskO_ = 0,
        curMode = "avatar";
    var tmpmpFace_ = "temp/tempface.bin",
        server_assetsPath = "lib/assets/mpsynth/";
    var synthesize_URL = MpConfig["serverURL"] + "synthesize";
    var getFeaturePoint_URL = MpConfig["serverURL"] + "feature_points";
    var makeover_URL = MpConfig["serverURL"] + "makeover";
    var makeover_synthesize_URL = MpConfig["serverURL"] + "makeover_synthesize";
    var aging3d_URL = MpConfig["serverURL"] + "aging/3d";
    var aging2d_URL = MpConfig["serverURL"] + "aging/2d";
    var mkmovie_URL = MpConfig["serverURL"] + "moviemaker/shoot";
    var mkmovie_gerResult_URL = MpConfig["serverURL"] + "moviemaker/";
    var mkovURL = "mkovrmoviewebgl.php";
    var LOAD_COMPLETED_EVENT        = "mpLoadComplete",
        LOAD_YOURAVATAR_EVENT       = "mpLoadYourAvatarComplete",
        LOAD_AVATARAGING_EVENT      = "mpLoadAvatarAgingComplete",
        LOAD_VIDEO_EVENT            = "mpLoadVideoComplete",
        GET_FEATURE_POINT_OK_EVENT  = "mpGetFeaturePointComplete",
        GET_FEATURE_POINT_ERROR     = "mpGetFeaturePointError",
        TIMEOUT_REQUET_ERROR        = "mpTimeoutRequestError",
        GLOBAL_ERROR                = "mpGlobalError";
    var _checkInstance = function() {
            if (!$.mpwebgl.instance) {
                mpwgl = new mpwgl();
                mpwgl.init();
            }
        },
        _Trigger = function(e, data) {
            $(document).trigger(e, data);
        },
        _base64DecToArr = function(sBase64, nBlocksSize) {
            var sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, ""),
                nInLen = sB64Enc.length,
                nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2,
                taBytes = new Uint8Array(nOutLen);

            for (var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
                nMod4 = nInIdx & 3;
                nUint24 |= _b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 18 - 6 * nMod4;
                if (nMod4 === 3 || nInLen - nInIdx === 1) {
                    for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
                        taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
                    }
                    nUint24 = 0;
                }
            }
            return taBytes;
        },
        _b64ToUint6 = function(nChr) {
            return nChr > 64 && nChr < 91 ? nChr - 65 :
                nChr > 96 && nChr < 123 ? nChr - 71 :
                nChr > 47 && nChr < 58 ? nChr + 4 :
                nChr === 43 ? 62 :
                nChr === 47 ? 63 :
                0;
        },
        _FSWait = function(callback, path) {
            setTimeout(function() {
                if (iscomplete_) {
                    callback(path);
                } else {
                    _FSWait(callback, path);
                }
            }, 300);
        },
        _unzipAgingAvatar = function(byteData) {
            var zip = new JSZip(byteData);
            var files = ['face.bin', 'old/hige.png', 'old/hige_mesh.bin', 'young/hige.png', 'young/hige_mesh.bin'];
            var n = files.length;
            var i = 0;
            files.forEach(function(filename) {
                var aryu8 = zip.file(filename).asUint8Array();
                var f = FS.open('temp/' + filename, 'w+');
                FS.write(f, aryu8, 0, aryu8.length, 0);
                FS.close(f);
                FS.syncfs(true, function(err) {
                    mpwgl.loadAgingAvatar(n, ++i);
                });
            });
        }, 
        _downloadAllAgingRes = function(data) {
            var files = ['face.bin', 'old/hige.png', 'old/hige_mesh.bin', 'young/hige.png', 'young/hige_mesh.bin'];
            var fileURLs = [data.bin, data.old.png, data.old.bin, data.young.png, data.young.bin];
            var authen =  btoa(MpConfig["id"] + ":" + MpConfig["key"]);
            var n = files.length;
            var i = 0, numLoaded = 0;
            files.forEach(function(filename) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', fileURLs[i], true);
                xhr.responseType = 'arraybuffer';
                xhr.setRequestHeader("Authorization", "Basic " + authen);
                xhr.onload = function(e) {
                    var aryu8 = new Uint8Array(this.response); 
                    var f = FS.open('temp/' + filename, 'w+');
                    FS.write(f, aryu8, 0, aryu8.length, 0);
                    FS.close(f);
                    FS.syncfs(true, function(err) {
                        mpwgl.loadAgingAvatar(n, ++numLoaded);
                    });
                };
                xhr.send();
                i++;
            });
        },
        _validateMpFace= function() {
            if(mpFaceId_ == undefined || mpFaceId_ < 0)
                return false;
            return true;

        }
    mpwgl.prototype = {
        constructor: mpwgl,
        init: function() {
            var url = "../js1/mpcore.min.js";
            $.getScript(url, function() {
                $.mpwebgl.instance = mpwgl;
                if ($.mpwebgl.options.size != undefined && $.mpwebgl.options.size[0])
                    dw_ = $.mpwebgl.options.size[0];
                if ($.mpwebgl.options.size != undefined && $.mpwebgl.options.size[1])
                    dh_ = $.mpwebgl.options.size[1];
                if($.mpwebgl.options.size[0] == undefined || $.mpwebgl.options.size[1] == undefined){
                    Browser.setCanvasSize(Module['canvas'].width, Module['canvas'].height);
                }
                else{
                    Browser.setCanvasSize(dw_, dh_);
                }
                var att = {
                    antialias: 0,
                    depth: 0,
                    stencil: 0,
                    alpha: 1,
                    premultipliedAlpha: 0
                };
                Module.ctx = Browser.createContext(Module['canvas'], true, true, att);
            });
        },
        init_mp_param: function() {
            _checkInstance();
            mpFace_ = new Module.MpFace();
            mpRender_ = new Module.MpRender();
            mpRender_.Init();
            mpRender_.SetFace(mpFace_);
            mpCtlBeard_ = mpFace_.GetCtlItem(Module.MpFaceItemType.ITEM_TYPE_BEARD);
            mpCtlHair_ = mpFace_.GetCtlItem(Module.MpFaceItemType.ITEM_TYPE_HAIR);
            mpCtlGlasses_ = mpFace_.GetCtlItem(Module.MpFaceItemType.ITEM_TYPE_GLASSES);
            mpCtlAnim_ = mpFace_.GetCtlAnimation();
            mpCosme_ = new Module.MpCosme();
            setInterval(mpwgl.animate, 20);
            _Trigger(LOAD_COMPLETED_EVENT);
            iscomplete_ = true;
        },
        lookat: function(x, y) {
            if ($.mpwebgl.options.lookat != undefined && $.mpwebgl.options.lookat == true && mpCtlAnim_) {
                mpCtlAnim_.LookAt(0, [x, y], 1.0);
            }
        },
        resetlookat: function() {
            if ($.mpwebgl.options.lookat != undefined && $.mpwebgl.options.lookat == true && mpCtlAnim_) {
                mpCtlAnim_.LookAt(500, [0.5, 0.5], 1.0);
            }
        },
        loadyouravatar: function() {
            bgdraw = true;
            mpwgl.loadavatar(tmpmpFace_);
            _Trigger(LOAD_YOURAVATAR_EVENT);
        },
        loadAgingAvatar: function(n, i) {
            if (n == i) {
                bgdraw = true;
                mpwgl.loadavatar('temp/face.bin');
                agingMaskY_ = mpwgl.loadAgingMask(agingMaskY_, 'temp/young');
                agingMaskO_ = mpwgl.loadAgingMask(agingMaskO_, 'temp/old');
                mpCtlAnim_.SetExprData('items/aging_expr.txt');
                _Trigger(LOAD_AVATARAGING_EVENT);
            }
        },
        loadDefaultAvatarWithAgingMask: function() {
            mpwgl.loadavatar('temp/tempface.bin');
            agingMaskY_ = mpwgl.loadAgingMask(agingMaskY_, 'temp/young');
            agingMaskO_ = mpwgl.loadAgingMask(agingMaskO_, 'temp/old');
            mpCtlAnim_.SetExprData('items/aging_expr.txt');
        },
        loadAgingMask: function(id, name) {
            if (id) {
                mpCtlBeard_.UnsetItem(id);
                mpCtlBeard_.Destroy(id);
            }
            id = mpCtlBeard_.Create(name);
            mpCtlBeard_.SetAlpha(id, 0);
            mpCtlBeard_.SetItem(id, 0);
            return id;
        },
        doaging: function(val) {
            if (!agingMaskY_ || !agingMaskO_) // not aging mode
                return;

            var gainY = (val < 0.5) ? (0.5 - val) * 2.0 : 0.0;
            var gainO = (val < 0.5) ? 0.0 : (val - 0.5) * 2.0;
            mpCtlBeard_.SetAlpha(agingMaskY_, gainY);
            mpCtlBeard_.SetAlpha(agingMaskO_, gainO);
            if (gainO > 0.0) {
                mpCtlAnim_.ExpressBySlot(13, 1, gainO, 1.0);
            } else {
                mpCtlAnim_.ExpressBySlot(14, 1, gainY, 1.0);
            }
        },
        loadnextface:function(name ){
            bgdraw = false;
            return mpwgl.loadavatar(name);
        },
        loadavatar: function(name) {
            if (name == undefined || name == "") {
                mess_ = "face not found";
                return mpFaceId_ = -1;
            }
            _checkInstance();
            mpwgl.destroyvoice();
            mpwgl.unloadanimation();
            mpwgl.pauseaudio();
            mpwgl.unloadcosme(CosmeType.ALL);
            Module['canvas'].style.backgroundColor = "transparent";
            try {
                mpFaceId_ = mpFace_.Load(name);
            } catch (e) {
                mess_ = e;
                mpFaceId_ = -1;
            }
            mpRender_.EnableDrawBackground(bgdraw);
            mpCtlAnim_.SetParamf(Module.MpCtlAnimationParam.NECK_X_MAX_ROT, 2.0);
            mpCtlAnim_.SetParamf(Module.MpCtlAnimationParam.NECK_Y_MAX_ROT, 2.0);
            mpCtlAnim_.SetParamf(Module.MpCtlAnimationParam.NECK_Z_MAX_ROT, 0.2);
            mpCtlAnim_.JSSetParamiv = function(arr) {
                var data = new Int32Array([arr[0], arr[1], arr[2]]);
                var nDataBytes = data.length * data.BYTES_PER_ELEMENT;
                var dataPtr = Module._malloc(nDataBytes);
                Module.HEAP32.set(data, dataPtr / data.BYTES_PER_ELEMENT);
                mpCtlAnim_.SetParamiv(Module.MpCtlAnimationParam.BLINK_FREQS, dataPtr);
            }
            mpCtlAnim_.JSSetParamiv([5, 0, 1]);
            mpCtlAnim_.SetExprData('items/faceanim.txt');
            return mpFaceId_;
        },
        setColor:function(type, id, r, g, b){
            switch(parseInt(type)){
                case 1 : //hair
                    mpCtlHair_.SetColor(id, r, g, b);
                    break;
                case 2 : //beard
                    mpCtlBeard_.SetColor(id, r, g, b);
                    break;
            }
        },
        unloadhair: function() {
            if (mpHairId_ != undefined && mpHairId_ > 0) {
                mpCtlHair_.UnsetItem(mpHairId_);
                mpCtlHair_.Destroy(mpHairId_);
                mpHairId_ = 0;
            }
        },
        loadhair: function(name) {
            if(!_validateMpFace())
                return 0;
            if (name == undefined || name == "") {
                mess_ = "hair not found";
                return mpHairId_ = 0;;
            }
            mpwgl.unloadhair();
            try {
                mpHairId_ = mpCtlHair_.Create(name);
            } catch (e) {
                mess_ = e;
                mpHairId_ = 0;
            }
            mpCtlHair_.SetItem(mpHairId_, 0);
            mpCtlHair_.Adjust(mpHairId_, [1.0, 1.0, 0.0, 0.0]);
            return mpHairId_;
        },
        unloadbear: function() {
            if (mpBeardId_ != undefined && mpBeardId_ > 0) {
                mpCtlBeard_.UnsetItem(mpBeardId_);
                mpCtlBeard_.Destroy(mpBeardId_);
                mpBeardId_ = 0;
            }
        },
        loadbeard: function(name) {
            if(!_validateMpFace())
                return 0;
            if (name == undefined || name == "") {
                mess_ = "beard not found";
                return mpBeardId_ = 0;
            }
            mpwgl.unloadbear();
            try {
                mpBeardId_ = mpCtlBeard_.Create(name);
            } catch (e) {
                mess_ = e;
                mpBeardId_ = 0;
            }
            mpCtlBeard_.SetItem(mpBeardId_, 0);
            mpCtlBeard_.Adjust(mpBeardId_, [1.0, 1.0, 0.0, 0.0]);
            return mpBeardId_;
        },
        unloadglasses: function() {
            if (mpGlassesId_ != undefined && mpGlassesId_ > 0) {
                mpCtlGlasses_.SetGlassesTexture(mpGlassesId_, Module.MpCtlItemGlassesTexType.GLASSES_TEX_COLOR, "");
                mpCtlGlasses_.UnsetItem(mpGlassesId_);
                mpCtlGlasses_.Destroy(mpGlassesId_);
                mpGlassesId_ = 0;
            }
        },
        loadglasses: function(name) {
            if(!_validateMpFace())
                return 0;
            if (name == undefined || name == "") {
                mess_ = "glasses not found";
                return mpGlassesId_ = 0;
            }
            mpwgl.unloadglasses();
            try {
                mpGlassesId_ = mpCtlGlasses_.Create(name);
            } catch (e) {
                mess_ = e;
                mpGlassesId_ = 0;
            }
            mpCtlGlasses_.SetItem(mpGlassesId_, 0);
            return mpGlassesId_;
        },
        doAdjust: function(id, param){
            mpCtlGlasses_.Adjust(id, param);
        },
        loadglassesLen: function(name) {
            if(!_validateMpFace())
                return 0;
            if (mpGlassesId_ != undefined && mpGlassesId_ > 0) {
                mpCtlGlasses_.SetGlassesTexture(mpGlassesId_, Module.MpCtlItemGlassesTexType.GLASSES_TEX_COLOR, name);
                mpCtlGlasses_.SetGlassesLensColor(mpGlassesId_, [1.0, 1.0, 1.0, 1.0]);
            }
        },
        unloadglassesLen: function() {
            if (mpGlassesId_ != undefined && mpGlassesId_ > 0) {
                mpCtlGlasses_.SetGlassesTexture(mpGlassesId_, Module.MpCtlItemGlassesTexType.GLASSES_TEX_COLOR, "");
            }
        },

        loadvoice: function(name) {
            if(!_validateMpFace())
                return 0;
            // console.log("mpwgl = ");
            // console.log(mpwgl);
            mpwgl.destroyvoice();
            mpwgl.unloadanimation();
            mpwgl.pauseaudio();
            if (!audio_) {
                audio_ = new Audio('');
            }
            mpVoice_ = mpFace_.GetCtlSpeech();
            mpVoiceId_ = mpVoice_.CreateVoice(name + '.env');
            if (audio_ && !audio_.ended) {
                audio_.pause();
            }
            mpVoice_ = mpFace_.GetCtlSpeech();
            audio_.src = name + '.env';
            //audio_.src = name + '.env';
            audio_.addEventListener('canplaythrough', function() {
                audio_.play();
                mpVoice_.Speak(mpVoiceId_);
            }, false);
            audio_.addEventListener('canplay', function() {}, false);
            audio_.addEventListener('playing', function() {}, false);
            audio_.load();
            return mpVoiceId_;
        },

        loadvoicewav: function(path, file) {
           
            if(!_validateMpFace())
                return -1;
            mpwgl.destroyvoice();
            mpwgl.unloadanimation();
            mpwgl.pauseaudio();
           var isLoaded = true;
           try {
               FS.stat(path + file);
           } catch (e) {
               isLoaded = false;
           }
           if (isLoaded) {
                mpwgl.loadwave(path + file);
           } else {
               var url = MpConfig["documentPath"] + path + file;
               FS.createPath('/', path, true, false);
               FS.createPreloadedFile(path, file, url, true, false);
               _FSWait(mpwgl.loadwave, path + file);
           }
            return mpVoiceId_;  
        },
        loadwave: function(path) {
            if(!_validateMpFace())
                return 0;
            mpVoice_ = mpFace_.GetCtlSpeech();
            mpVoiceId_ = mpVoice_.CreateVoice(path);
            if (!audio_) {
                audio_ = new Audio('');
            } else {
                if (!audio_.ended) {
                    audio_.pause();
                }
            }
            mpVoice_ = mpFace_.GetCtlSpeech();
            var url = MpConfig["documentPath"] + path;
            audio_.src = url;
            audio_.addEventListener('canplaythrough', function() {
                audio_.play();
                mpVoice_.Speak(mpVoiceId_);
            }, false);
            audio_.addEventListener('canplay', function() {}, false);
            audio_.addEventListener('playing', function() {

            }, false);
            audio_.load();
        },
        unloadcosme: function(type) {
            if(mpCosme_ && mpFace_)
                mpCosme_.UnsetCosme(mpFace_);
            switch(type){
                case CosmeType.LIP :
                    if(mpCosmeLipId_ > 0){
                        mpCosme_.Destroy(mpCosmeLipId_);
                        mpCosmeLipId_ = 0;
                    }
                    break;
                case CosmeType.EYE :
                    if(mpCosmeEyeId_ > 0){
                        mpCosme_.Destroy(mpCosmeEyeId_);
                        mpCosmeEyeId_ = 0;
                    }
                    break;
                case CosmeType.CHEEK :
                    if(mpCosmeCheekId_ > 0){
                        mpCosme_.Destroy(mpCosmeCheekId_);
                        mpCosmeCheekId_ = 0;
                    }
                    break;
                default :
                    if(mpCosmeLipId_ > 0){
                        mpCosme_.Destroy(mpCosmeLipId_);
                        mpCosmeLipId_ = 0;
                    }
                    if(mpCosmeEyeId_ > 0){
                        mpCosme_.Destroy(mpCosmeEyeId_);
                        mpCosmeEyeId_ = 0;
                    }
                    if(mpCosmeCheekId_ > 0){
                        mpCosme_.Destroy(mpCosmeCheekId_);
                        mpCosmeCheekId_ = 0;
                    }
                    break;
            }
        },
        loadcosme: function(name, type) {
            if(!_validateMpFace())
                return 0;
            if (name == undefined || name == "") {
                mess_ = "cosme not found";
                return 0;
            }
            mpwgl.unloadcosme(type);
            var ret = 0;
            try {
                switch(type){
                    case CosmeType.LIP :
                        mpCosmeLipId_ = mpCosme_.Create(name);
                        ret = mpCosmeLipId_;
                        break;
                    case CosmeType.EYE :
                        mpCosmeEyeId_ = mpCosme_.Create(name);
                        ret = mpCosmeEyeId_;
                        break;
                    case CosmeType.CHEEK :
                        mpCosmeCheekId_ = mpCosme_.Create(name);
                        ret = mpCosmeCheekId_;
                        break;
                }
            } catch (e) {
                mess_ = e;
                ret = 0;
            }
            if(mpCosmeLipId_ > 0)
                mpCosme_.SetCosme(mpFace_, mpCosmeLipId_, [1.0, 1.0, 1.0, 1.0]);
            if(mpCosmeEyeId_ > 0)
                mpCosme_.SetCosme(mpFace_, mpCosmeEyeId_, [1.0, 1.0, 1.0, 1.0]);
            if(mpCosmeCheekId_ > 0)
            mpCosme_.SetCosme(mpFace_, mpCosmeCheekId_, [1.0, 1.0, 1.0, 1.0]);
            return ret;
        },
        //loadexpression: function(index = 0, milisecond = 0, gain = 1.0, weight = 1.0, expStart = 11) {
        loadexpression: function(index, milisecond, gain, weight, expStart) { // for safari 
            if(!_validateMpFace())
                return 0;
            if(index === undefined){index = 0;}
            if(milisecond === undefined){milisecond = 0;}
            if(gain === undefined){gain = 1.0;}
            if(weight === undefined){weight = 1.0;}
            if(expStart === undefined){expStart = 11;}
            var gains = new Float32Array(32);
            for (var i = 0; i < 32; i++) {
                gains[i] = (i == expStart + index) ? gain : 0.0;
            }
            var gainsPtr = Module._malloc(32 * gains.BYTES_PER_ELEMENT);
            Module.HEAPF32.set(gains, gainsPtr / gains.BYTES_PER_ELEMENT);
            try {
                mpCtlAnim_.Express(milisecond, gainsPtr, weight);
            } catch (e) {
                mess_ = e;
                return 0;
            }
            Module._free(gainsPtr);
            return 1;
        },
        loadanimation: function(name) {
            if(!_validateMpFace())
                return 0;
            try{
                mpwgl.destroyvoice();
                mpwgl.unloadanimation();
                mpwgl.pauseaudio();
                if (!animAudio_) {
                    animAudio_ = new Audio('');
                }
                mpAnim_ = mpCtlAnim_.CreateAnimation(name + '/anim.ani2');
                mpCtlAnim_.SetExprData(name + '/anim.txt');
                mpCtlAnim_.SetUnconsciousGain(0.0);
                animAudio_.src = name + '/anim.mp3';
                animAudio_.addEventListener('canplaythrough', function() {
                    animAudio_.play();
                    animStartTime_ = new Date().getTime();
                }, false);
                animAudio_.load();
                return 1;
            }
            catch(e){
                return 0;
            }
        },
        unloadanimation:function () {
            if (mpAnim_) {
                mpCtlAnim_.DestroyAnimation(mpAnim_);
                mpAnim_ = 0;
                mpCtlAnim_.RestoreExprData();
                mpCtlAnim_.SetUnconsciousGain(1.0);
                animStartTime_ = 0;
            }
        },
        pauseaudio:function() {
            if (animAudio_ && !animAudio_.paused) {
                animAudio_.pause();
            }
            if(audio_ && !audio_.paused){
                audio_.pause();
            }
        },
        isanimplaying:function(value) {
            var ret = 0;
            switch(value){
                case 1: //anim
                    if (animAudio_ && !animAudio_.paused) {
                        ret = 1;
                    }
                    break;
                case 2: //speak
                case 3: //speakwav
                    if(audio_ && !audio_.paused){
                        ret = 2;
                    }
                    break;
                default :
                    ret = 0;
                    break;
            }
            return ret;
        },
        destroyvoice: function() {
            if (mpVoiceId_ > 0) {
                mpVoice_.SpeakStop();
                mpVoice_.DestroyVoice(mpVoiceId_);
            }
            mpVoiceId_ = 0;
        },
        setRefraction: function(val) {
            if(!_validateMpFace())
                return 0;
            var slot = 0;
            var gain = 0.0;
            if (val > 0.5) {
                 slot = 10;
                 gain = (val - 0.5) * 2.0;
            } else {
                 slot = 11;
                 gain = (0.5 - val) * 2.0;
            }
            mpCtlAnim_.ExpressBySlot(slot, 1, gain, 1.0);
        },
        requestAvatar: function(file, mode, exFP) {
            if (exFP == undefined) exFP = "";
            var params = { 
                autodetect: 1,
                format: "BIN",
                texsize: 512,
                modelsize: 256,
                eyekeep: 1,
                expand: 16,
                blur : 64,
                facepos : 0.5,
                facesize: 0.4,
                cropmargin : 1,
                backphoto : 1,
                face_fp : true,
                contour_equal_face : 0
            };
            var urlPost ="";
            if(mode == "avatar"){
                urlPost = synthesize_URL;
            }
            else if(mode == "mkovr"){
                var sel = $("#MkOvrType")[0];
                var namemko = sel[sel.selectedIndex].value;
                params["mkovrmodel"] = server_assetsPath + "makeover/"  + namemko + ".mko";
                urlPost = makeover_synthesize_URL;
            }
            else if(mode == "aging"){
                params["skindir"] = server_assetsPath + "aging";
                urlPost = aging3d_URL;
            }
            else if(mode == "mkmovie"){
                mpwgl.requestVideo(file);
                //mpwgl.requestVideo_php(file);
                return;
            }
            else if(mode == "featurepoint"){
                mpwgl.requestFeaturePoint(file);
                return;
            }
            var str = jQuery.param(params);
            curMode = mode;
            var authen =  btoa(MpConfig["id"] + ":" + MpConfig["key"]);
            var form_data = new FormData();             
            form_data.append("file", file);            
            if(exFP){
                form_data.append("feature_points", JSON.stringify(exFP));
            }
            $.ajax({
                url: urlPost + "?" + str,
                type: "POST",
                data: form_data,
                contentType: false,
                processData: false,
                headers: {
                    "Authorization": "Basic " + authen
                },
                success:function(data) {                    
                    if(curMode == "" || curMode == null)
                        return;
                    if(curMode == "avatar" || curMode == "mkovr"){
                        var wdata = _base64DecToArr(data);
                        var f = FS.open(tmpmpFace_, 'w+');
                        FS.write(f, wdata, 0, wdata.length, 0);
                        FS.close(f);
                        FS.syncfs(true, function(err) {
                            mpwgl.loadyouravatar();
                            curMode = "";
                        });
                    }
                    else if(curMode == "aging"){
                        //_unzipAgingAvatar(_base64DecToArr(data.zip));
                        _downloadAllAgingRes(data);
                    }
                },
                error:function(data) {
                    _Trigger(GLOBAL_ERROR, data);
                },
                timeout:function(data) {
                    _Trigger(TIMEOUT_REQUET_ERROR, data);
                },
            })
        },
        requestFeaturePoint: function(file) {
            var authen =  btoa(MpConfig["id"] + ":" + MpConfig["key"]);
            var urlPost = getFeaturePoint_URL;
            var form_data = new FormData();             
            form_data.append("file", file); 
            $.ajax({
                context: this,
                url: urlPost,
                type: "POST",
                data: form_data,
                contentType: false,
                processData: false,
                headers: {
                    "Authorization": "Basic " + authen
                },
                success:function(data) {   
                    _Trigger(GET_FEATURE_POINT_OK_EVENT, data);
                },
                error:function(data) {
                    var mess = JSON.parse(data.responseText);
                    _Trigger(GET_FEATURE_POINT_ERROR, mess);
                },
                timeout:function(data) {
                    var mess = JSON.parse(data.responseText);
                    _Trigger(TIMEOUT_REQUET_ERROR, mess);
                },
            })
        },
        requestVideo: function(file) {
            var sel = $("#mkMovieType")[0];
            var nameMovie = sel[sel.selectedIndex].value;
            var urlPost = mkmovie_URL;
            var params = {
                vclip : nameMovie,
                ofps : 30,
                vbitrate : 200000,
                abitrate : 120200,
                qscale : 1,
                saturation : 50,
                vformat : "mp4"     
            };
            var form_data = new FormData();             
            form_data.append("img0", file)
            var str = jQuery.param(params);
            var authen =  btoa(MpConfig["id"] + ":" + MpConfig["key"]);
            var dataUid, isTrigger = false;

            var pingResult = function(data){
                var xhr = new XMLHttpRequest();
                xhr.open('GET', mkmovie_gerResult_URL + data.uid, true);
                xhr.responseType = 'arraybuffer';
                xhr.setRequestHeader("Authorization", "Basic " + authen);
                xhr.onload = function(e) {
                    if (this.status == 200) {
                        var uInt8Array = new Uint8Array(this.response);
                        var i = uInt8Array.length;
                        var binaryString = new Array(i);
                        while (i--){
                            binaryString[i] = String.fromCharCode(uInt8Array[i]);
                        }
                        var data = binaryString.join('');
                        var base64 = window.btoa(data);
                        mpwgl.destroyvoice();
                        mpwgl.unloadanimation();
                        mpwgl.pauseaudio();
                        _Trigger(LOAD_VIDEO_EVENT, base64);
                    }
                    else if(this.status == 202){
                        setTimeout(function() {
                            pingResult(dataUid);
                        }, 1000);
                    }
                    else if(this.status == 422){
                        xhr.abort();
                    }
                };
                xhr.send();
            };
            $.ajax({
                context: this,
                url: urlPost + "?" + str,
                type: "POST",
                data: form_data,
                contentType: false,
                processData: false,
                headers: {
                    "Authorization": "Basic " + authen
                },
                success:function(data) {   
                    dataUid = data;
                    pingResult(dataUid);
                },
                error:function(data) {
                    _Trigger(GLOBAL_ERROR, data);
                },
                timeout:function(data) {
                    _Trigger(TIMEOUT_REQUET_ERROR, data);
                },
            })
        },
        requestVideo_php: function(file) {
            var formData = new FormData();
            formData.append("Filedata", file);
            var sel = $("#mkMovieType")[0];
            formData.append("content", sel.selectedIndex);
            var urlReq = new String(mkovURL);
            jQuery.ajax({
               url : urlReq,
               type : 'POST',
               data : formData,
               processData: false,
               contentType: false,
               cache : false,
               success : function(data) {
                 _Trigger(LOAD_VIDEO_EVENT, data);
               },
               error:function(data) {
                    _Trigger(GLOBAL_ERROR, data);
                },
                timeout:function(data) {
                    _Trigger(TIMEOUT_REQUET_ERROR, data);
                },
            });
        },
        animate: function(name) {
            if(!_validateMpFace())
                return;
            var timeNow = new Date().getTime();
            if (startTime_ == 0) {
                startTime_ = timeNow;
            }
            if (lastTime_ != 0) {
                var elapsed = timeNow - lastTime_;
            }
            lastTime_ = timeNow;
            if ($.mpwebgl.options.showfps != undefined && $.mpwebgl.options.showfps == true) {
                if (!(num_counter_ % 16)) {
                    $("#fpscounter").html("FPS : " + parseInt(1000 / elapsed));
                }
                num_counter_ += 1;
            }
            mpCtlAnim_.Update(timeNow - startTime_);
            if (mpAnim_ && animStartTime_) {
                var playing = mpCtlAnim_.AnimateData(animStartTime_ - startTime_, timeNow - startTime_, mpAnim_, true);
                if (playing == 0) {
                    mpCtlAnim_.DestroyAnimation(mpAnim_);
                    mpAnim_ = 0;
                    mpCtlAnim_.RestoreExprData();
                    mpCtlAnim_.SetUnconsciousGain(1.0);
                    animStartTime_ = 0;
                }
            }
            mpRender_.SetViewport([0, 0, Module['canvas'].width, Module['canvas'].height]);
            GLctx.clearColor(0.0, 0.0, 0.0, 0.0);
            GLctx.clear(Module.ctx.COLOR_BUFFER_BIT);
            mpRender_.Draw();
            if (bgdraw) {
                GLctx.colorMask(0, 0, 0, 1);
                GLctx.clearColor(0.0, 0.0, 0.0, 1.0);
                GLctx.clear(Module.ctx.COLOR_BUFFER_BIT);
                GLctx.colorMask(1, 1, 1, 1);
            }
        }
    };
    $.mpwebgl = {
        instance: null,
        proto: mpwgl.prototype,
        options: null,
        modules: []
    };
    $.fn.mpwebgl = function(options) {
        $.mpwebgl.options = options;
        Module['canvas'] = $(this)[0];
        // console.log( "this = ");
        // console.log( $(this)[0]);
        // console.log()
        _checkInstance();
        return $.mpwebgl;
    };
}));
