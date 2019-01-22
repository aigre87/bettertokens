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
                        button.btn.btn-block(type='button' @click="authorize()" v-if="hasWavesKeeper") Authorize via Waves Keeper
                        p(v-if="!hasWavesKeeper")
                            | To continue, please install the browser extension&nbsp;
                            a(href="#") WavesKeeper
                            | &nbsp;and reload this page.

                    form(method='post' action='/application-progress#apply' enctype='multipart/form-data' v-if="auth.authed")
                        .row
                            .col-md-6
                                .input-wrap
                                    label.control-label-block Email
                                    input.form-input.email(name='email' type='email' placeholder='email@sample.com' v-model='form.email' @blur="onBlur()" :disabled="form.applied")
                                .input-wrap
                                    label.control-label-block Link to the project&rsquo;s website
                                    input.form-input.website(name='link' type='text' placeholder='https://website.com/' v-model='form.link' @blur="onBlur()" :disabled="form.applied")
                                .input-wrap
                                    label.control-label-block Token ID on Waves Blockchain
                                    input.form-input.required(name='tokenid' type='text' placeholder='84Y1Ub3Kp9uitTTgKGPhgZE6EC793XuC3muoJC8zsFi2' v-model='form.tokenId' @blur="onBlur()" :disabled="form.applied")
                                .input-wrap
                                    label.control-label-block Basic description of the project
                                    textarea.form-input.required(name='description' maxlength='300' cols='30' rows='5' placeholder='Type the main idea of your project here (300 symbols)' v-model='form.description' @blur="onBlur()" :disabled="form.applied")
                            .col-md-6
                                .input-wrap
                                    label.control-label-block Project name
                                    input.form-input.required(name='projectname' type='text' placeholder='Name' v-model='form.projectname' @blur="onBlur()" :disabled="form.applied")
                                .input-wrap
                                    label.control-label-block Crypto wallet address
                                    input.form-input.required(name='address' type='text' placeholder='3PCAB4sHXgvtu5NPoen6EXR5yaNbvsEA8Fj' v-model='form.address' @blur="onBlur()" :disabled="form.applied")
                                .input-wrap
                                    label.control-label-block Requested ticker
                                    input.form-input.required(name='ticker' type='text' placeholder='TCKR' v-model='form.ticker' @blur="onBlur()" :disabled="form.applied")
                                .input-wrap.input-wrap--attach
                                    label.control-label-block Attach documents
                                    .file-upload-block
                                        vue-dropzone(ref="fUploader" id="dropzone" :options="dropzoneOptions" @vdropzone-removed-file="removeFile" @vdropzone-success="uploadSuccess"  multiple :disabled="form.applied")
                                            .dropzone-custom-content
                                                h3.dropzone-custom-title Drag and drop to upload content!
                                                .subtitle ...or click to select a file from your computer
                        .row.justify-content-md-end
                            .col-md-2
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
	import vue2Dropzone from 'vue2-dropzone';

	export default {
		name      : 'app',
		formReady : false,
		components: {
			vueDropzone: vue2Dropzone
		},
		data      : () => ({
			hasWavesKeeper : false,
			authed         : false,
			auth           : {},
			dropzoneOptions: {
				url           : '/apply/upload',
				thumbnailWidth: 150,
				maxFilesize   : 50,
				addRemoveLinks: true,
				duplicateCheck: true,
				options       : {
					createImageThumbnails: false,
					paramName            : 'docs',
					previewsContainer    : '.test.dropzone-previews'
				}
			},
			form           : {},
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
		methods   : {
			async authorize() {
				if (this.auth.authed) return;
				try {
					let signed = await WavesKeeper.auth({data: this.auth.token});
					let res = await webApi.emit('auth do', signed);
					if (!res) return;
					this.auth = await webApi.emit('auth status');
					this.form = this.auth.authed ? await webApi.emit('form apply get') || {} : {};
				} catch (e) {}
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
				await webApi.emit('form apply apply');
				this.form.applied = true;
			}
		}
	};
</script>

<style scoped>
    .vue-dropzone {
        border        : 1px solid #767676;
        border-radius : 8px;
    }
    .logout{
	    color: #0055FF;
    }
    .dz-preview {
        display : block !important;
    }
</style>