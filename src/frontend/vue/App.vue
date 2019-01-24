<template lang="pug">
    .applications.tabset(style="margin-top: -100px;")
        div(style="width:100%;height: 100px;")
            ul.page-nav.tab-control
                li(v-for="tab in tabs" :class="{active: tab.active}"): a(:href="'#'+tab.id" @click="tabClick(tab)"): svg(:viewbox="tab.viewbox" :style="{width: tab.width + 'px'}" ): text(y='38') {{tab.name}}
        .application-item.tab#pre(:class="{active:currentTab.id==='pre'}")
            .application-item__header Pre-application
            .application-item__expand(v-show="currentTab.id==='pre'")
                include app.pre.pug

        .application-item.tab#apply(:class="{active:currentTab.id==='apply'}")
            .application-item__header Apply
            .application-item__expand(v-show="currentTab.id==='apply'")
                include app.apply.pug
                section.form-section
                    .block-title Apply now
                    .row(v-if="auth.authed"): .col-md-10
                        p:  h5 Authorized as {{auth.address}} &nbsp;
                            a.logout(href="/apply/logout") logout
                        p The form is automatically saved, click Apply button when all fields are filled and files are attached.
                    .row: .col-md-10(v-if="!auth.authed")
                        p
                            | For apply an application, you must login through Waves Keeper
                        button.btn.authorizeBtn(type='button' @click="authorize()" v-if="hasWavesKeeper") AUTHORIZE
                        p(v-if="!hasWavesKeeper")
                            <span v-html="noWavesKeeperText"></span>

                    form(method='post' action='/application-progress#apply' enctype='multipart/form-data' v-if="auth.authed")
                        .row
                            .col-md-6
                                .input-wrap(:class="{ validateError : $v.form.email.$invalid && formClicked.email || $v.form.email.$invalid && trySending }")
                                    label.control-label-block Email
                                    .input-wrap-w
                                        input.form-input.email(name='email' type='email' placeholder='email@sample.com' v-model='form.email' @blur="function(){formClicked.email = true;onBlur();}()" :disabled="form.applied")
                                        span.validateErrorText Please enter email
                                .input-wrap(:class="{ validateError : $v.form.link.$invalid && formClicked.link || $v.form.link.$invalid && trySending }")
                                    label.control-label-block Link to the project&rsquo;s website
                                    .input-wrap-w
                                        input.form-input.website(name='link' type='text' placeholder='https://website.com/' v-model='form.link' @blur="function(){formClicked.link = true;onBlur();}()" :disabled="form.applied")
                                        span.validateErrorText Please enter link
                                .input-wrap(:class="{ validateError : $v.form.tokenId.$invalid && formClicked.tokenId || $v.form.tokenId.$invalid && trySending }")
                                    label.control-label-block Token ID in Waves Blockchain
                                    .input-wrap-w
                                        input.form-input.required(name='tokenid' type='text' placeholder='84Y1Ub3Kp9uitTTgKGPhgZE6EC793XuC3muoJC8zsFi2' v-model='form.tokenId' @blur="function(){formClicked.tokenId = true;onBlur();}()" :disabled="form.applied")
                                        span.validateErrorText Please enter Token ID
                                .input-wrap(:class="{ validateError : $v.form.description.$invalid && formClicked.description || $v.form.description.$invalid && trySending }")
                                    label.control-label-block Basic description of the project
                                    .input-wrap-w
                                        textarea.form-input.required(name='description' maxlength='300' cols='30' rows='5' placeholder='Type the main idea of your project here (300 symbols)' v-model='form.description' @blur="function(){formClicked.description = true;onBlur();}()" :disabled="form.applied")
                                        span.validateErrorText Please enter description
                            .col-md-6
                                .input-wrap(:class="{ validateError : $v.form.projectname.$invalid && formClicked.projectname || $v.form.projectname.$invalid && trySending }")
                                    label.control-label-block Project name
                                    .input-wrap-w
                                        input.form-input.required(name='projectname' type='text' placeholder='Name' v-model='form.projectname' @blur="function(){formClicked.projectname = true;onBlur();}()" :disabled="form.applied")
                                        span.validateErrorText Please enter project name
                                .input-wrap(:class="{ validateError : $v.form.address.$invalid && formClicked.address || $v.form.address.$invalid && trySending }")
                                    label.control-label-block Crypto wallet address
                                    .input-wrap-w
                                        input.form-input.required(name='address' type='text' placeholder='3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8Fj' v-model='form.address' @blur="function(){formClicked.address = true;onBlur();}()" :disabled="form.applied")
                                        span.validateErrorText Please enter address
                                .input-wrap(:class="{ validateError : $v.form.ticker.$invalid && formClicked.ticker || $v.form.ticker.$invalid && trySending }")
                                    label.control-label-block Requested ticker
                                    .input-wrap-w
                                        input.form-input.required(name='ticker' type='text' placeholder='TCKR' v-model='form.ticker' @blur="function(){formClicked.ticker = true;onBlur();}()" :disabled="form.applied")
                                        span.validateErrorText Please enter ticker
                                .input-wrap.input-wrap--attach
                                    label.control-label-block Attach documents
                                    .file-upload-block
                                        vue-dropzone(ref="fUploader" id="dropzone" :options="dropzoneOptions" @vdropzone-removed-file="removeFile" @vdropzone-success="uploadSuccess"  multiple :disabled="form.applied")
                                            <!--.dropzone-custom-content-->
                                                <!--h3.dropzone-custom-title Drag and drop to upload content!-->
                                                <!--.subtitle ...or click to select a file from your computer-->
                        .row.justify-content-md-end
                            //.col-md-2
                                button.btn.btn-block(type='button' @click="clear()" v-if="!form.applied") CLEAR
                            .col-md-3
                                button.btn.btn-block(type='button' @click="apply()" v-if="!form.applied") APPLY
                        .row.justify-content-md-end(v-if="form.applied")
                            .col-md-4.text-right
                                p: h3 Your form has been applied

        .application-item.tab#review(:class="{active:currentTab.id==='review'}")
            .application-item__header Review
            .application-item__expand(v-show="currentTab.id==='review'")
                include app.review.pug
        .application-item.tab#faq(:class="{active:currentTab.id==='faq'}")
            .application-item__header FAQ
            .application-item__expand(v-show="currentTab.id==='faq'")
                .row
                    .col-md-12
                        include ../../views/includes/faq.pug
</template>

<script>
    import 'remodal/dist/remodal-default-theme.css';
    import 'remodal/dist/remodal.min.js';
    import vue2Dropzone from 'vue2-dropzone';
    import Vuelidate from 'vuelidate';
    import { required, minLength, minValue, url, email } from 'vuelidate/lib/validators';

    export default {
        name      : 'app',
        formReady : false,
        components: {
            vueDropzone: vue2Dropzone,
            Vuelidate: Vuelidate
        },
        validations:{
            form:{
                email:{
                    required,
                    email
                },
                projectname:{
                    required,
                    minLength: minLength(1)
                },
                link:{
                    required,
                    url
                },
                address:{
                    required,
                    minLength: minLength(1)
                },
                tokenId:{
                    required,
                    minLength: minLength(1)
                },
                description:{
                    required,
                    minLength: minLength(1)
                },
                ticker:{
                    required,
                    minLength: minLength(1)
                }
            }
        },
        data      : () => ({
            hasWavesKeeper : false,
            trySending     : false,
            authed         : false,
            auth           : {},
            dropzoneOptions: {
                url           : '/apply/upload',
                thumbnailWidth: 150,
                maxFilesize   : 50,
                acceptedFiles: "application/pdf, .docx",
                dictDefaultMessage: '.pdf&nbsp;&nbsp;&nbsp;&nbsp;.docx',
                addRemoveLinks: true,
                duplicateCheck: true,
                options       : {
                    createImageThumbnails: false,
                    paramName            : 'docs',
                    previewsContainer    : '.test.dropzone-previews'
                }
            },
            formClicked :{
                email       : false,
                projectname : false,
                link        : false,
                address     : false,
                tokenId     : false,
                description : false,
                ticker      : false
            },
            form           : {
                "email": "",
                "link": null,
                "tokenId": null,
                "description": null,
                "projectname": null,
                "address": null,
                "ticker": null,
                "applied": null,
                "uploads": []
            },
            currentTab     : {},
            tabs           : [{
                name   : 'Pre-application',
                id     : 'pre',
                width  : 276,
                viewbox: '0 0 278 50',
                active : false
            }, {
                name   : 'Apply',
                id     : 'apply',
                width  : 104,
                viewbox: '0 0 278 50',
                active : false
            }, {
                name   : 'Review',
                id     : 'review',
                width  : 130,
                viewbox: '0 0 278 50',
                active : false
            }, {
                name   : 'FAQ',
                id     : 'faq',
                width  : 74,
                viewbox: '0 0 278 50',
                active : false
            }]
        }),
        async mounted() {
            if (window.location.hash) {
                app.tools.iterate(this.tabs, (tab) => {
                    if (`#${tab.id}` === window.location.hash.toLowerCase()) this.currentTab = tab;
                });
            }

            await webApi.ready();
            this.auth = await webApi.emit('auth status');
            this.form = this.auth.authed ? await webApi.emit('form apply get') || {} : {};
            tools.iterate(this.form.uploads, (upload) => {
                this.$refs.fUploader.manuallyAddFile({
                    uid : upload.uid,
                    size: upload.size,
                    name: upload.fileName,
                    type: upload.mimeType
                }, `/apply/docs/${upload.uid}`);
            });

            if (!this.currentTab.id) this.currentTab = this.tabs[0];
            this.hasWavesKeeper = !!window.WavesKeeper;
            this.currentTab.active = true;
        },
        computed: {
            noWavesKeeperText: function () {
                if( typeof InstallTrigger !== 'undefined' ){//is firefox
                    return `To continue, please
                        <a href='https://addons.mozilla.org/ru/firefox/addon/waves-keeper/'>install the browser extension WavesKeep
                        and reload this page.`;
                }else if( navigator.userAgent.indexOf("Chrome") != -1 ){//is chrome
                    return `To continue, please
                        <a href='https://chrome.google.com/webstore/detail/waves-keeper/lpilbniiabackdjcionkobglmddfbcjo'>install the browser extension WavesKeep
                        and reload this page.`;
                }else{
                    return `Waves Keeper is not available for your browser yet.
                        Please, use <a target='_blank' href='https://www.google.com/chrome/'>Chrome</a>
                        or <a target='_blank' href='https://www.mozilla.org/ru/firefox/'>Firefox</a>.`;
                }
            }
        },
        methods   : {
            async authorize() {
                console.log("authorize");
                if (this.auth.authed) return;

                try {
                    console.log(this.auth.token);
                    let signed = await WavesKeeper.auth({data: this.auth.token});
                    console.log(signed);
                    let res = await webApi.emit('auth do', signed);
                    if (!res) return;
                    this.auth = await webApi.emit('auth status');
                    this.form = this.auth.authed ? await webApi.emit('form apply get') || {} : {};
                } catch (e) {
                    console.log(e);
                    if( e.message === 'WavesKeeper contains co accounts' ){
                        if( $('[data-remodal-id=remodalTmpText]').length == 0 ){
                            $("body").append(`<div>
                                            <div data-remodal-id='remodalTmpText'>${e.message}.<br />Please go to extension and login</div>
                            </div>`);
                        }
                        $('[data-remodal-id=remodalTmpText]').remodal().open();
                    }
                    if (e.message === 'Api rejected by user') {
                        if( $('[data-remodal-id=remodalTmpText]').length == 0 ){
                            $("body").append(`<div>
                                            <div data-remodal-id='remodalTmpText'>${e.message}.<br />Please go to extension and approve permision</div>
                            </div>`);
                        }
                        $('[data-remodal-id=remodalTmpText]').remodal().open();
                    }
                }
            },
            tabClick(tab) {
                app.tools.iterate(this.tabs, (t) => t.active = false);
                tab.active = true;
                this.currentTab = tab;
                window.location.hash = `#${tab.id}`;
            },
            clear() {
                this.form = {};
                this.onBlur();
            },
            async onBlur() {
                await webApi.emit('form apply update', this.form);
            },
            async removeFile(file, error, xhr) {
                if (!file || !file.uid) return;
                await webApi.emit('form apply upload remove', file.uid);
            },
            uploadSuccess(file, response) {
                if (!response || !response.uid) return;
                file.uid = response.uid;
            },
            async apply() {
                this.trySending = true;
                this.$v.form.$touch();
                if (this.$v.$invalid) {

                }else{
                    console.log(0);
                    await webApi.emit('form apply apply');
                    console.log(1);
                    this.form.applied = true;
                    this.$forceUpdate();
                }
            }
        }
    };
</script>

<style scoped>
    .authorizeBtn{
        padding-left: 70px;
        padding-right: 70px;
        letter-spacing: 2px;
    }
    .vue-dropzone {
        min-height: 235px;
        border        : 1px dashed #777;
        border-radius : 8px;
        background: transparent;
        padding: 18px 20px;
    }
    .logout{
        color: #0055FF;
    }
    .dz-preview {
        display : block !important;
    }
</style>

<style lang="scss">
    .page-application .vue-dropzone .dz-message{
        margin: 0;
        font-size: 18px;
        color: #c7c7c7;
        text-align: left;
    }
    .page-application .input-wrap{
        .input-wrap-w{
            position: relative;
        }
        .validateErrorText{
            color: #0055FF;
            position: absolute;
            left: 8px;
            top: 0px;
            padding: 0 5px;
            font-size: 14px;
            line-height: 16px;
            background: #fff;
            transform: translateY(-50%);
            opacity: 0;
        }
        &.validateError{
            .form-input {
                border: 1px solid #0055FF;
            }
            .validateErrorText{
                opacity: 1;
            }
        }
    }
    #main .dz-preview{
        margin: 0;
    }
</style>
