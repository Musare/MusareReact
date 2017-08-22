import React, {Component} from "react";
import async from "async";
import PropTypes from "prop-types";
import {connect} from "react-redux";
import {NavLink} from "react-router-dom";
import {translate} from "react-i18next";

// import "termsPrivacy.scss";

@translate(["terms"], {wait: true})
export default class Terms extends Component {
	static propTypes = {
		t: PropTypes.func,
	};

	static defaultProps = {
		t: () => {
		},
	};

	render() {
		const {t} = this.props;

		return (
			<main>
				<h1>{t("terms:title")}</h1>
				<h3>Last Updated: January 25, 2016</h3>

				<h4>1. Introduction</h4>
				<p>Musare.com (“musare” or the “Site”) is a social viewing platform that allows you and your friends to
					watch videos and listen to music together and to provide social commentary based on their
					experiences (collectively the “Content”). Before viewing, using, or interacting with our Site you
					must first agree to these Terms of (“Agreement” or “Terms”). When we say “you” we mean the person
					who is viewing, interacting, or registering with our Site, along with anyone that they may
					represent. When we say “Musare,” “musare.com,“ “us,” “our” or “we,” we are referring to the owners
					of the Site, and its successors and assigns. This Agreement, along with our Privacy Policy and any
					other agreements will govern our relationship. By using the Site, you acknowledge and accept the
					Site’s Privacy Policy and consent to the collection and use of your data in accordance with the
					Privacy Policy.</p>
				<p>In some instances, both these Terms and separate guidelines, rules, or terms of service or sale
					setting forth additional or different terms and/or conditions will apply to your use of the Site or
					to a service or product offered via the Site (in each such instance, and collectively “Additional
					Terms”). To the extent there is a conflict between these Terms and any Additional Terms, the
					Additional Terms will control unless the Additional Terms expressly state otherwise.</p>

				<h4>2. Description of Service</h4>
				<p>Musare is an online platform that melds social media and entertainment. In other words, Musare is
					designed to allow you and your friends to watch videos or listen to music together. As part of our
					platform you will create a unique profile that will allow others to find you and for you to express
					yourself. As of now, we require all of our users to be at least 13 years old. If you are between the
					ages of 13 and 17 then we may require you to obtain permission from your parents to agree to these
					Terms. If you are under the age of majority in your state or jurisdiction of residence, you may use
					the Site only with involvement of a parent or guardian who agrees to these Terms and to be
					responsible for your use.</p>

				<h4>3. Accounts and Profiles</h4>
				<p>In order for you to access Musare we may require that you create a unique account to associate with a
					profile. You may be required to provide us with information, which includes, but is not limited to,
					your name, address, email address, a unique login name and password. The Site’s practices governing
					any resulting collection and use of your personal information are disclosed in its Privacy Policy.
					It is your responsibility to also keep this information updated and accurate.</p>
				<p>We may also allow you to use a third party API to sign up for our Site, like GitHub Authentication.
					Whenever you use this feature, certain information will be transferred from the third party account
					and will populate your profile here at Musare. It is important to read and understand that third
					parties privacy and information sharing practices and principles. More importantly, you will be
					making certain information publicly viewable.</p>
				<p>If you register for any feature that requires a password and/or username, then you will select your
					own password at the time of registration (or we may send you an e-mail notification with a randomly
					generated initial password) and you agree that: (i) You will not use a username (or e-mail address)
					that is already being used by someone else, may impersonate another person, belongs to another
					person, violates the intellectual property or other right of any person or entity, or is offensive.
					We may reject the use of any password, username, or e-mail address for any other reason in our sole
					discretion; (ii) You will provide true, accurate, current, and complete registration information
					about yourself in connection with the registration process and, as permitted, to maintain and update
					it including on your Profile Page, continuously and promptly to keep it accurate, current, and
					complete; (iii) You are solely responsible for all activities that occur under your account,
					password, and username – whether or not you authorized the activity; (iv) You are solely responsible
					for maintaining the confidentiality of your password and for restricting access to your Device so
					that others may not access any password protected portion of the Site using your name, username, or
					password; (v) You will immediately notify us of any unauthorized use of your account, password, or
					username, or any other breach of security; and (vi) You will not sell, transfer, or assign your
					account or any account rights.</p>
				<p>We will not be liable for any loss or damage (of any kind and under any legal theory) to you or any
					third party arising from your inability or failure for any reason to comply with any of the
					foregoing obligations.</p>
				<p>If any information that you provide, or if we have reasonable grounds to suspect that any information
					that you provide, is false, inaccurate, outdated, incomplete, or violates these Terms, any
					Additional Terms, or any applicable law, then we may suspend or terminate your account. We also
					reserve the more general and broad right to terminate your account or suspend or otherwise deny you
					access to it or its benefits – all in our sole discretion, for any reason, and without advance
					notice or liability.</p>
				<p>Your Site page where you maintain a profile (“Profile Page”) may not include any form of prohibited
					User-Generated Content (defined below), as outlined in Section 6 below. Without limiting the
					foregoing, Profile Pages may not include content that you are attempting to sell through the Site,
					and cannot be used to conduct commercial activities, including, but not limited to, transactions,
					advertising, fundraising, contests or other promotions absent our prior written consent. We may
					offer you the ability to set preferences relating to your profile or Site activities, but settings
					may not become effective immediately or be error free, and options may change from time-to-time. We
					assume no responsibility or liability for users’ Profile material.</p>
				<p>Profile Pages may only be set up by an authorized representative of the individual that is the
					subject of the Profile Page. We do not review Profile Pages to determine if they were created by an
					appropriate party, and we are not responsible for any unauthorized Profile Pages that may appear on
					the Site. If there is any dispute as to whether a Profile Page has been created or is being
					maintained by an authorized representative of the individual who is the subject of that Profile
					Page, then we shall have the sole right, but are not obligated, to resolve such dispute as we
					determine is appropriate in our sole discretion. Such resolution may include, without limitation,
					deleting or disabling access to Profile Pages, or any portion thereof, at any time without
					notice.</p>

				<h4>4. Site Content, Ownership, Limited License and Rights of Others</h4>
				<p><b>A. Content.</b> The Site contains a variety of: (i) materials and other items relating to Musare
					and its products and services, and similar items from our licensors and other third parties,
					including all layout, information, articles, posts, text, data, files, images, scripts, designs,
					graphics, button icons, instructions, illustrations, photographs, audio clips, music, sounds,
					pictures, videos, advertising copy, URLs, technology, software, interactive features, the “look and
					feel” of the Site, and the compilation, assembly, and arrangement of the materials of the Site and
					any and all copyrightable material (including source and object code); (ii) trademarks, logos, trade
					names, trade dress, service marks, and trade identities of various parties, including those of
					Musare (collectively, “Trademarks”); and (iii) other forms of intellectual property (all of the
					foregoing, collectively “Content”).</p>
				<p><b>B. Ownership.</b> The Site (including past, present, and future versions) and the Content are
					owned or controlled by Musare and our licensors and certain other third parties. All right, title,
					and interest in and to the Content available via the Site is the property of Musare or our licensors
					or certain other third parties, and is protected by U.S. and international copyright, trademark,
					trade dress, patent and/or other intellectual property and unfair competition rights and laws to the
					fullest extent possible. Musare owns the copyright in the selection, compilation, assembly,
					arrangement, and enhancement of the Content on the Site</p>
				<p><b>C. Limited License.</b> Subject to your strict compliance with these Terms and the Additional
					Terms, Musare grants you a limited, non-exclusive, revocable, non-assignable, personal, and
					non-transferable license to: (i) download (temporary storage only), display, view, use, play, and/or
					print one copy of the Content (excluding source and object code in raw form or otherwise, other than
					as made available to access and use to enable display and functionality) on a personal computer,
					mobile phone or other wireless device, or other Internet enabled device (each, a “Device”) for your
					personal, non-commercial use only, and (ii) to use certain Content that we may from time to time
					make available on the Site explicitly for you for use as part of your User-Generated Content. The
					foregoing limited license: (i) does not give you any ownership of, or any other intellectual
					property interest in, any Content, and (ii) may be immediately suspended or terminated for any
					reason, in Musare’s sole discretion, and without advance notice or liability. In some instances, we
					may permit you to have greater access to and use of Content, subject to certain Additional Terms.
				</p>
				<p><b>D. Rights of Others.</b> In using the Site, you must respect the intellectual property and other
					rights of Musare and others. Your unauthorized use of Content may violate copyright, trademark,
					privacy, publicity, communications, and other laws, and any such use may result in your personal
					liability, including potential criminal liability. Musare respects the intellectual property rights
					of others. If you believe that your work has been infringed by means of an improper posting or
					distribution of it via the Site, then please see Section 8 below.</p>

				<h4>5. Content You Submit</h4>
				<p><b>A. General.</b> Musare may now or in the future offer users of the Site the opportunity to create,
					build, post, upload, display, publish, distribute, transmit, broadcast, or otherwise make available
					on or submit through the Site (collectively, “submit”) messages, avatars, text, illustrations,
					files, images, graphics, photos, comments, responses, sounds, music, videos, information, content,
					ratings, reviews, data, questions, suggestions, personally identifiable information, or other
					information or materials and the ideas contained therein (collectively, “User-Generated Content”).
					Musare may allow you to do this through forums, blogs, message boards, social networking
					environments, content creation tools, gameplay, social communities, contact us tools, e-mail, and
					other communications functionality. Subject to the rights and license you grant in these Terms, you
					retain whatever legally cognizable right, title, and interest that you have in your User-Generated
					Content and you remain ultimately responsible for it.</p>
				<p><b>B. Non-Confidentiality of Your User-Generated Content.</b> Except as otherwise described in the
					Site’s posted Privacy Policy or any Additional Terms, you agree that: (a) your User-Generated
					Content will be treated as non-confidential – regardless of whether you mark them “confidential,”
					“proprietary,” or the like – and will not be returned, and (b) Musare does not assume any obligation
					of any kind to you or any third party with respect to your User-Generated Content. Upon Musare’s
					request, you will furnish us with any documentation necessary to substantiate the rights to such
					content and to verify your compliance with these Terms or any Additional Terms. You acknowledge that
					the Internet and mobile communications may be subject to breaches of security and that you are aware
					that submissions of User-Generated Content may not be secure, and you will consider this before
					submitting any User-Generated Content and do so at your own risk. In your communications with
					Musare, please keep in mind that we do not seek any unsolicited ideas or materials for products or
					services, or even suggested improvements to products or services, including, without limitation,
					ideas, concepts, inventions, or designs for music, web sites, apps, books, scripts, screenplays,
					motion pictures, television shows, theatrical productions, software or otherwise (collectively,
					“Unsolicited Ideas and Materials”). Any Unsolicited Ideas and Materials you post on or send to us
					via the Site are deemed User-Generated Content and licensed to us as set forth below. In addition,
					Musare retains all of the rights held by members of the general public with regard to your
					Unsolicited Ideas and Materials. Musare’s receipt of your Unsolicited Ideas and Materials is not an
					admission by Musare of their novelty, priority, or originality, and it does not impair Musare’s
					right to contest existing or future intellectual property rights relating to your Unsolicited Ideas
					and Materials.</p>
				<p><b>C. License to Musare of Your User-Generated Content.</b> Except as otherwise described in any
					applicable Additional Terms (such as a contest official rules), which specifically govern the
					submission of your User-Generated Content, you hereby grant to Musare, the non-exclusive,
					unrestricted, unconditional, unlimited, worldwide, irrevocable, perpetual, and cost-free right and
					license to use, copy, record, distribute, reproduce, disclose, sell, re-sell, sublicense (through
					multiple levels), display, publicly perform, transmit, publish, broadcast, translate, make
					derivative works of, and otherwise use and exploit in any manner whatsoever, all or any portion of
					your User-Generated Content (and derivative works thereof), for any purpose whatsoever in all
					formats, on or through any means or medium now known or hereafter developed, and with any technology
					or devices now known or hereafter developed, and to advertise, market, and promote the same. Without
					limitation, the granted rights include the right to: (a) configure, host, index, cache, archive,
					store, digitize, compress, optimize, modify, reformat, edit, adapt, publish in searchable format,
					and remove such User-Generated Content and combine same with other materials, and (b) use any ideas,
					concepts, know-how, or techniques contained in any User-Generated Content for any purposes
					whatsoever, including developing, producing, and marketing products and/or services. You understand
					that in exercising such rights metadata, notices and content may be removed or altered, including
					copyright management information, and you consent thereto and represent and warrant you have all
					necessary authority to do so. In order to further effect the rights and license that you grant to
					Musare to your User-Generated Content, you also hereby grant to Musare, and agree to grant to
					Musare, the unconditional, perpetual, irrevocable right to use and exploit your name, persona, and
					likeness in connection with any User-Generated Content, without any obligation or remuneration to
					you. Except as prohibited by law, you hereby waive, and you agree to waive, any moral rights
					(including attribution and integrity) that you may have in any User-Generated Content, even if it is
					altered or changed in a manner not agreeable to you. To the extent not waivable, you irrevocably
					agree not to exercise such rights (if any) in a manner that interferes with any exercise of the
					granted rights. You understand that you will not receive any fees, sums, consideration, or
					remuneration for any of the rights granted in this Section 5(C).</p>
				<p><b>D. Exclusive Right to Manage Our Site.</b> Musare may, but will not have any obligation to,
					review, monitor, display, post, store, maintain, accept, or otherwise make use of, any of your
					User-Generated Content, and Musare may, in its sole discretion, reject, delete, move, re-format,
					remove or refuse to post or otherwise make use of User-Generated Content without notice or any
					liability to you or any third party in connection with our operation of User-Generated Content
					venues in an appropriate manner. Without limitation, we may do so to address content that comes to
					our attention that we believe is offensive, obscene, lewd, lascivious, filthy, violent, harassing,
					threatening, abusive, illegal or otherwise objectionable or inappropriate, or to enforce the rights
					of third parties or these Terms or any applicable Additional Terms, including, without limitation,
					the content restrictions set forth below in Section 6. Such User-Generated Content submitted by you
					or others need not be maintained on the Site by us for any period of time and you will not have the
					right, once submitted, to access, archive, maintain, or otherwise use such User-Generated Content on
					the Site or elsewhere.</p>
				<p><b>E. Representations and Warranties Related to Your User-Generated Content.</b> Each time you submit
					any User-Generated Content, you represent and warrant that you are at least the age of majority in
					the jurisdiction in which you reside and are the parent or legal guardian, or have all proper
					consents from the parent or legal guardian, of any minor who is depicted in or contributed to any
					User-Generated Content you submit, and that, as to that User-Generated Content, (a) you are the sole
					author and owner of the intellectual property and other rights to the User-Generated Content, or you
					have a lawful right to submit the User-Generated Content and grant Musare the rights to it that you
					are granting by these Terms and any Additional Terms, all without any Musare obligation to obtain
					consent of any third party and without creating any obligation or liability of Musare; (b) the
					User-Generated Content is accurate; (c) the User-Generated Content does not and, as to Musare’s
					permitted uses and exploitation set forth in these Terms, will not infringe any intellectual
					property or other right of any third party; and (d) the User-Generated Content will not violate
					these Terms (including the Rules) or any Additional Terms, or cause injury or harm to any person.
				</p>
				<p><b>F. Enforcement.</b> Musare has no obligation to monitor or enforce your intellectual property
					rights to your User-Generated Content, but you grant us the right to protect and enforce our rights
					to your User-Generated Content, including by bringing and controlling actions in your name and on
					your behalf (at Musare’s cost and expense, to which you hereby consent and irrevocably appoint
					Musare as your attorney-in-fact, with the power of substitution and delegation, which appointment is
					coupled with an interest).</p>

				<h4>6. Our Rules</h4>
				<p>We may, but are not obligated to, provide our users with the ability to post and receive messages
					from other Musare-listed users or allow you to participate in video or live chats with your friends
					or other users. If we do, you will not use the messaging system or your username to spam, defame,
					harass, or do anything we find to be objectionable (which is up to us), including, but not limited
					to, language that attacks or demeans a group based on race or ethnic origin, religion, disability,
					gender, age, veteran status and sexual orientation or gender identity. It is your responsibility to
					maintain proper etiquette, and we reserve the right to terminate the account for anyone who violates
					our policies. We also do not monitor any particular chat, but reserve the right to edit, modify,
					ban, or filter any User-Generated Content or username for any reason. If someone posts something
					that is offensive or objectionable please let us know and we will do our best to accommodate you. We
					do not, however, assume any obligation to remove such User-Generated Content.</p>
				<p>You may share videos and music that is hosted on a third party website (i.e., Youtube, Soundcloud,
					etc.) but only if it does not conflict with their terms or any applicable law. You may not, however,
					share, post or otherwise communicate any content (video, audio, or text) that is unlawful,
					threatening, violent, pornographic, harassing, obscene, racist, defamatory, or otherwise
					objectionable. We reserve the right to determine what is objectionable at our sole discretion.</p>
				<p>In addition to the above, you agree that you will not:</p>
				<ul>
					<li>* Infringe on anyone's intellectual property or other legal rights (i.e. invasion of privacy).
					</li>
					<li>* Hack, crack, phish, SQL inject, or otherwise compromise the security of our website or its
						servers.
					</li>
					<li>* Solicit business, spam, or otherwise use our service for commercial purposes unless expressly
						authorized by us.
					</li>
					<li>* Defraud or threaten any of our users through any method, whether it be through our website or
						through another method of communication.
					</li>
					<li>* Create more than one active user account, or create a new user account if we have previously
						banned, suspended, or otherwise terminated your first user account.
					</li>
					<li>* Harass anyone.</li>
					<li>* Impersonate anyone.</li>
					<li>* Do anything unlawful or bad (we define what is bad)</li>
				</ul>
				<p>How we react to your violation of any of these Terms does not mean we will treat everyone the same.
					We may do anything from giving you a spoken warning, temporarily suspend your account, ban you, or
					take you to Court.</p>

				<h4>7. Sharing Videos and Music</h4>
				<p>Musare may permit you to share videos and music with your friends. We may also allow you to use video
					or live chat to discuss the video or music as it is playing. Please note, however, that we do not
					host any User-Generated Content ourselves. Instead, you must use our platform to share your video or
					music from the third party video hosting website. You agree that you will be responsible for the
					User-Generated Content you upload, and that nothing you share will infringe on the rights of anyone.
					Furthermore, you warrant you have the ability to grant the right to share such User-Generated
					Content without any obligation to pay any royalties to any copyright owner. You will be responsible
					for the payment of any royalty and any associated damages, fees, fines or penalties, in the event we
					find out you have shared User-Generated Content in violation of another’s intellectual property
					rights.</p>
				<p>Not to sound like a broken record, but we have to make sure you understand that you will be
					responsible for any User-Generated Content that you upload, including the consequences of any
					infringement. By sharing any User-Generated Content you are, in essence, utilizing a third party
					license to distribute and share User-Generated Content. You may only do this if the Site from which
					you are linking has given you a license to share such User-Generated Content in the manner
					contemplated. If it does not, then you cannot share that User-Generated Content.</p>
				<p>For further clarity, you must only distribute videos or music that you are legally permitted
					to...meaning you cannot share videos or music that violates anyone’s third party intellectual
					property rights. For example, you must not share anything that the third party site would prohibit.
					In addition you will not modify, edit, disassemble, or create derivatives of anything that you do
					not own the rights to.</p>
				<p>Should you believe that your rights are being infringed on by, please note that we are not
					responsible for hosting it and it is the third party site which is serving the file, and until is
					removed from the third party site, it will still be available through their search engine. As such,
					copyright notices should be sent to both us and the third party site, and you should visit their
					terms for more information.</p>

				<h4>8. DMCA Notices</h4>
				<p>We will respond appropriately to notices of alleged copyright infringement that comply with the U.S.
					Digital Millennium Copyright Act (“DMCA”), as set forth below. We have registered a Copyright Agent
					with the United States Copyright Office, which limits our liability under the DMCA. If you believe
					that your copyright has been infringed, please send us a message that contains:</p>
				<ul>
					<li>* Your name.</li>
					<li>* The name of the party whose copyright has been infringed, if different from your name.</li>
					<li>* The name and description of the work that is being infringed.</li>
					<li>* The location on our website of the infringing copy.</li>
					<li>* A statement that you have a good faith belief that use of the copyrighted work described above
						is not authorized by the copyright owner (or by a third party who is legally entitled to do so
						on behalf of the copyright owner) and is not otherwise permitted by law.
					</li>
					<li>* A statement that you swear, under penalty of perjury, that the information contained in this
						notification is accurate and that you are the copyright owner or have an exclusive right in law
						to bring infringement proceedings with respect to its use.
					</li>
				</ul>
				<p>Musare’s designated Copyright Agent to receive notifications of claimed infringement is Musare, Inc.,
					5900 Wilshire Blvd, 21st Floor, Los Angeles, CA 90036 (Attn: Legal Department); email:
					musaremusic@gmail.com. For clarity, only DMCA notices should go to the Copyright Agent; am other
					feedback, comments, requests for technical support, and other communications should be directed to
					musare customer service.</p>
				<p>If sending the notification by e-mail, an electronic signature is acceptable.</p>
				<p>Upon notification of claimed infringement, we will respond expeditiously to remove, or disable access
					to, the material that is claimed to be infringing or to be the subject of infringing activity. We
					will also notify the person who posted, uploaded or otherwise placed the allegedly infringing
					material on the Site that we have removed or disabled access to such material.</p>
				<p>If you believe that material has been removed improperly, you must send a written counter
					notification to the Agent, and include:</p>
				<ul>
					<li>* a. a physical or electronic signature of the subscriber;</li>
					<li>* b. identification of the material that has been removed or to which access has been disabled
						and the location at which the material appeared before it was removed or access to it was
						disabled;
					</li>
					<li>* c. a statement under penalty of perjury that the subscriber has a good faith belief that the
						material was removed or disabled as a result of mistake or misidentification of the material to
						be removed or disabled;
					</li>
					<li>* d. the subscriber’s name, address, and telephone number, and a statement that the subscriber
						consents to the jurisdiction of Federal District Court for the judicial district in which the
						address is located, or if the subscriber’s address is outside of the United States, for any
						judicial district in which the service provider may be found, and that the subscriber will
						accept service of process from the person who provided the original notification or an agent of
						such person.
					</li>
				</ul>
				<p>Upon receipt of a counter notification complying with the foregoing requirements, we will promptly
					provide the person who I provided the original notification with a copy of the counter notification,
					and inform that person that we will replace the removed material or cease disabling access to it in
					ten (10) business days, unless we receive notice that the original notifier has notified the
					designated agent for the counter notifier that such person has filed an action seeking a court order
					to restrain the subscriber from engaging in infringing activity relating to the material on our
					system or network.</p>
				<p>It is our policy, in appropriate circumstances, to disable and/or terminate the accounts of users who
					are repeat infringers. It is also our policy to accommodate and not interfere with standard
					technical measures we determine are reasonable under the circumstances, i.e., technical measures
					that are used by copyright owners to identify or protect copyrighted works. We retain the discretion
					to handle non-compliant notices in whatever manner appears to be reasonable given the circumstances
					presented. There are penalties for submission of misleading information in connection with the
					process described herein.</p>

				<h4>9. Points and Virtual Currency</h4>
				<p>The Site may include virtual, in-game currency (“Virtual Currency”), such as credits, coins, ranks
					(“Name Tags”), XP, cash, or points (e.g., Experience Points), that may be purchased with “real
					world” money or obtained through spending time on the Site or otherwise interacting with a
					third-party service. Virtual Currency may be used to purchase virtual, in-game digital items
					(“Virtual Goods”). Your purchase or award of Virtual Currency and Virtual Goods are merely a grant
					by us to a limited, non-exclusive, revocable, non-assignable, personal, and non-transferable right
					to use the Virtual Currency and Virtual Goods as part of the Site under these Terms and any
					applicable Additional Terms we provide at the time. Accordingly, you have no property, proprietary,
					intellectual property, ownership, or monetary interest in your Virtual Currency and Virtual Goods,
					which remain our Content and property. The right may be immediately suspended or terminated for any
					reason, in our sole discretion, and without advance notice or liability. We reserve the absolute
					right, at any time and in our sole discretion, to manage, regulate, control, modify or eliminate
					Virtual Currency and/or Virtual Goods.</p>
				<p>Virtual Currency or Virtual Goods cannot be redeemed by you for “real world” money, goods, or other
					items of monetary value from any party. Transfers of Virtual Currency or Virtual Goods by you
					outside of what we permit on the Site are strictly prohibited. This means you may not buy or sell
					Virtual Currency or Virtual Goods for “real world” money or otherwise exchange items for value
					outside of the Site. Any such attempted transfer will be null and void.</p>
				<p>You also agree that all sales of Virtual Currency and Virtual Goods are final unless otherwise
					detailed in the applicable Additional Terms. No refunds will be given by us. You agree that you will
					be solely responsible for paying any applicable taxes related to the acquisition of, use of or
					access to Virtual Currency or Virtual Goods.</p>
				<p>We have the absolute right, but not the obligation, to manage, regulate, control, modify, delete,
					alter, move, remove, transfer and/or eliminate Virtual Currency and/or Virtual Goods, in whole or in
					part, as we see fit, at any time in our sole discretion, including the right to terminate or suspend
					your account or discontinue the Site (in whole or in part) for any reason, and we shall have no
					liability to you or anyone for the exercise of such rights. If we suspend or terminate any Virtual
					Currency or Virtual Goods, then you will forfeit the suspended or terminated subscription or items,
					except as may be set forth in any Additional Terms (such as any refund policies that may apply to
					the Site). Likewise, except as may be set forth in any Additional Terms or as required by applicable
					law, we are not responsible for repairing or replacing same, or providing you any credit or refund
					or any other sum, in the event of our modification of any Virtual Currency or Virtual Goods, or for
					loss or damage due to error, or any other reason.</p>
				<p>As we feel necessary, in our sole and absolute discretion, we may limit the total amount of Virtual
					Currency that may be purchased at any one time, and/or limit the total Virtual Currency that may be
					held in your account in the aggregate. Additionally, price and availability of certain types of
					Virtual Currency and/or Virtual Goods are subject to change without notice. You are solely
					responsible for verifying that the proper amount of Virtual Currency has been added to or deducted
					from your account during any given transaction, so please notify us immediately should you believe
					that a mistake has been made with respect to your Virtual Currency balance. If we choose, in our
					discretion, to investigate your claim, in doing so, may request some additional information and/or
					documentation to verify your claim. We will let you know the results of any investigation, however,
					you acknowledge and agree that we have the sole and absolute discretion in determining whether or
					not your claim is valid, and if so, the appropriate remedy.</p>
				<p>NOTWITHSTANDING ANYTHING TO THE CONTRARY HEREIN, YOU ACKNOWLEDGE AND AGREE THAT YOU SHALL HAVE NO
					OWNERSHIP OR OTHER PROPERTY INTEREST IN YOUR ACCOUNT, AND YOU FURTHER ACKNOWLEDGE AND AGREE THAT ALL
					RIGHTS IN AND TO THE ACCOUNT ARE AND SHALL FOREVER BE OWNED BY AND INURE TO THE BENEFIT OF MUSARE.
					YOU ACKNOWLEDGE AND AGREE THAT YOU HAVE NO CLAIM, RIGHT, TITLE, OWNERSHIP OR OTHER PROPRIETARY
					INTEREST IN THE VIRTUAL CURRENCY, VIRTUAL GOODS OR THAT YOU ACQUIRE, REGARDLESS OF THE CONSIDERATION
					OFFERED OR PAID IN EXCHANGE FOR VIRTUAL CURRENCY OR VIRTUAL ITEMS. FURTHERMORE, WE SHALL NOT BE
					LIABLE IN ANY MANNER FOR THE DESTRUCTION, DELETION, MODIFICATION, IMPAIRMENT, “HACKING,” OR ANY
					OTHER DAMAGE OR LOSS OF ANY KIND CAUSED TO THE VIRTUAL CURRENCY, VIRTUAL GOODS, INCLUDING, BUT NOT
					LIMITED TO, THE DELETION OF THEREOF UPON THE TERMINATION, ABANDONMENT OR EXPIRATION OF YOUR
					ACCOUNT.</p>

				{ /* <h4>10. Terms of Sale</h4>
				<p><b>SOON TO COME</b></p> */ }

				<h4>11. Disclaimer and Limitation of Liability</h4>
				<p>THE SITE AND OUR SERVICES ARE PROVIDED ON AN “AS IS” AND “AS AVAILABLE” BASIS. YOU EXPRESSLY AGREE
					THAT USE OF THE SITE AND OUR SERVICES IS AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMISSIBLE
					PURSUANT TO APPLICABLE LAW, WE DISCLAIM ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED,
					INCLUDING, WITHOUT LIMITATION, ANY WARRANTY OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE OR
					NON-INFRINGEMENT. WE DO NOT MAKE ANY WARRANTY THAT THE SITE OR OUR SERVICES WILL MEET YOUR
					REQUIREMENTS, OR THAT THE SERVICES WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR FREE, OR THAT
					DEFECTS, IF ANY, WILL BE CORRECTED; NOR DO WE MAKE ANY WARRANTY AS TO THE RESULTS THAT MAY BE
					OBTAINED FROM THE USE OF THE SITE OR OUR SERVICES OR AS TO THE ACCURACY OR RELIABILITY OF ANY
					INFORMATION OBTAINED THROUGH USE OF THE SITE OR OUR SERVICES. YOU UNDERSTAND AND AGREE THAT ANY
					MATERIAL AND/OR DATA DOWNLOADED OR OTHERWISE OBTAINED THROUGH THE USE OF THE SITE OR OUR SERVICES IS
					AT YOUR OWN DISCRETION AND RISK AND THAT YOU WILL BE SOLELY RESPONSIBLE FOR ANY DAMAGE TO YOUR
					COMPUTER SYSTEM OR LOSS OF DATA THAT RESULTS FROM THE DOWNLOAD OF SUCH MATERIAL AND/OR DATA. NO
					ADVICE OR INFORMATION, WHETHER ORAL OR WRITTEN, OBTAINED BY YOU FROM US OR THROUGH THE SITE SHALL
					CREATE ANY WARRANTY NOT EXPRESSLY MADE HEREIN. SOME JURISDICTIONS DO NOT ALLOW THE EXCLUSION OF
					CERTAIN WARRANTIES; SO SOME OF THE ABOVE EXCLUSIONS MAY NOT APPLY TO YOU.</p>
				<p>UNDER NO CIRCUMSTANCES, INCLUDING, WITHOUT LIMITATION, NEGLIGENCE, SHALL WE OR OUR PARENTS,
					SUBSIDIARIES, AFFILIATES, OFFICERS, DIRECTORS, MEMBERS, EMPLOYEES, AGENTS, OR SUPPLIERS BE LIABLE
					FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL OR CONSEQUENTIAL DAMAGES, RESULTING FROM THE USE OR
					THE INABILITY TO USE THE SITE OR FOR THE COST OF PROCUREMENT OF SUBSTITUTE GOODS AND SERVICES OR
					MESSAGES RECEIVED OR TRANSACTIONS ENTERED INTO BY MEANS OF OR THROUGH THE SITE, OR RESULTING FROM
					UNAUTHORIZED ACCESS TO OR ALTERATION OF YOUR TRANSMISSIONS OR DATA, OR OTHER INFORMATION THAT IS
					SENT OR RECEIVED OR NOT SENT OR RECEIVED, INCLUDING, BUT NOT LIMITED TO, DAMAGES FOR LOSS OF
					PROFITS, USE, DATA OR OTHER INTANGIBLES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH
					DAMAGES. YOU AGREE THAT WE ARE NOT LIABLE FOR ANY FAILURE TO DELIVER, HOLD OR STORE DATA,
					INFORMATION OR EMAIL TRANSMITTED THROUGH THE SITE. IF YOU ARE DISSATISFIED WITH THE SITE OR OUR
					SERVICES, YOUR EXCLUSIVE REMEDY IS TO DISCONTINUE USE OF THE SITE AND OUR SERVICES. SOME
					JURISDICTIONS DO NOT ALLOW THE LIMITATION OR EXCLUSION OF LIABILITY FOR INCIDENTAL OR CONSEQUENTIAL
					DAMAGES; SO SOME OF THE ABOVE MAY NOT APPLY TO YOU. IN NO EVENT WILL WE BE LIABLE TO YOU FOR MORE
					THAN THE ACTUAL DOLLAR AMOUNT THAT YOU PAID FOR THE USE OF THE SITE.</p>
				<p>Without limiting any of the foregoing, we are not responsible for any of your materials and data
					residing on our network hardware. You are responsible for backing-up your materials and data that
					may reside on our network, whether or not such materials and data are produced through the use of
					the Site.</p>

				<h4>12. Indemnity</h4>
				<p>You agree to indemnify, defend and hold harmless us, our parents, subsidiaries, affiliates, officers,
					directors, employees, members, partners, agents, and suppliers, and their respective affiliates,
					officers, directors, employees, members, shareholders, partners, and agents, from any claim, action,
					demand, liability, judgment, or damage, including reasonable attorneys’ fees, arising out of or
					related to your use of the Site and/or your violation of these Terms, including, without limitation,
					the infringement by you in your User-Generated Content or any other user of your account, of any
					intellectual property or other right of any person or entity. We may, at our sole discretion, assume
					the exclusive defense and control of any matter subject to indemnification by you. The assumption of
					such defense or control by us, however, shall not excuse any of your indemnity obligations.</p>

				<h4>13. Choice of Law</h4>
				<p>We wish to make things as simple as possible in applying this Agreement to our users, and we can’t do
					that if a different jurisdiction’s law applies for each user who signs up based on where they live.
					Therefore, you agree that this Agreement is subject solely to and shall be interpreted in accordance
					with the laws applicable in the State of California, USA, without regard to its conflicts of law
					provisions.</p>

				<h4>14. Dispute Resolution</h4>
				<p>Certain portions of this Section 14 are deemed to be a “written agreement to arbitrate” pursuant to
					the Federal Arbitration Act. You and Musare agree that we intend that this Section 14 satisfies the
					“writing” requirement of the Federal Arbitration Act. This Section 14 can only be amended by mutual
					agreement</p>
				<p><b>A. First – Try To Resolve Disputes and Excluded Disputes.</b> If any controversy, allegation, or
					claim arises out of or relates to the Site, the Content, your User-Generated Content, these Terms,
					or any Additional Terms, whether heretofore or hereafter arising (collectively, “Dispute”), or to
					any of Musare’s actual or alleged intellectual property rights (an “Excluded Dispute”, which
					includes those actions set forth in Section 14.D), then you and we agree to send a written notice to
					the other providing a reasonable description of the Dispute or Excluded Dispute, along with a
					proposed resolution of it. Our notice to you will be sent to you based on the most recent contact
					information that you provide us. But if no such information exists or if such information is not
					current, then we have no obligation under this Section 14.A. Your notice to us must be sent to:
					Musare, Inc., 5900 Wilshire Blvd, 21st Floor, Los Angeles, CA 90036 (Attn: Legal Department). For a
					period of sixty (60) days from the date of receipt of notice from the other party, Musare and you
					will engage in a dialogue in order to attempt to resolve the Dispute or Excluded Dispute, though
					nothing will require either you or Musare to resolve the Dispute or Excluded Dispute on terms with
					respect to which you and Musare, in each of our sole discretion, are not comfortable.</p>
				<p><b>B. Forums For Alternative Dispute Resolution.</b></p>
				<p><b>(i) Arbitration.</b> If we cannot resolve a Dispute as set forth in Section 14.A within sixty (60)
					days of receipt of the notice, then either you or we may submit the Dispute to formal arbitration in
					accordance with this Section 14.B. If we cannot resolve an Excluded Dispute as set forth in Section
					14.A within sixty (60) days of receipt of the notice, then either you or we may submit the Excluded
					Dispute to formal arbitration only if you and Musare consent, in a writing signed by you and an
					officer or legal representative of Musare, to have that Excluded Dispute subject to arbitration. In
					such a case, (and only in such a case), that Excluded Dispute will be deemed a “Dispute” for the
					remainder of this Section 14.B.</p>
				<p>Upon expiration of the applicable sixty-day period and to the fullest extent permitted by applicable
					law, a Dispute will be resolved solely by binding arbitration in accordance with the then-current
					Commercial Arbitration Rules of the American Arbitration Association (“AAA”). If the Dispute has a
					claimed value of not more than $250,000, then the arbitration will be heard and determined by a
					single neutral arbitrator who is a retired judge or a lawyer with not less than fifteen (15) years’
					experience as a practicing member of the bar in the substantive practice area related to the
					Dispute, who will administer the proceedings in accordance with the AAA’s Supplementary Procedures
					for Consumer Related Disputes. If the Dispute has a claimed value of more than $250,000, or if
					Musare elects, in its sole discretion, to bear the costs of arbitration in excess of those that
					would occur for a proceeding before a single neutral arbitrator, then the arbitration will be heard
					and determined by a three-member panel, with one member to be selected by each party and the third
					(who will be chair of the panel) selected by the two party-appointed members or by the AAA in
					accordance with the Commercial Arbitration Rules. The arbitrator or arbitration panel, as the case
					may be, will apply applicable law and the provisions of these Terms and any Additional Terms, will
					determine any Dispute according to the applicable law and facts based upon the record and no other
					basis, and will issue a reasoned award. If you and Musare do not both consent to the arbitration of
					an Excluded Dispute as set forth in the immediately preceding paragraph of this Section 14.B(i),
					then this paragraph and the remainder of this Section 14.B will not apply to the Excluded
					Dispute.</p>
				<p>If a party properly submits the Dispute to the AAA for formal arbitration and the AAA is unwilling or
					unable to set a hearing date within sixty (60) days of the filing of a “demand for arbitration,”
					then either party can elect to have the arbitration administered by the Judicial Arbitration and
					Mediation Services Inc. (“JAMS”) using JAMS’ streamlined Arbitration Rules and Procedures, or by any
					other arbitration administration Site that you and an officer or legal representative of Musare
					consent to in writing. The substantive practice area requirements for the arbitrator and the
					$250,000 threshold for a the number of arbitrators assigned to the Dispute set forth in the
					paragraph above for the AAA arbitration will also apply to any such arbitration under JAMS or
					another arbitration Site.</p>
				<p>You can obtain AAA and JAMS procedures, rules, and fee information as follows:</p>
				<p>
					AAA: 800.778.7879 http://www.adr.org <br/>
					JAMS: 949.224.1810 http://www.jamsadr.com</p>
				<p><b>(ii) Nature, Limitations, and Location of Alternative Dispute Resolution.</b> In arbitration, as
					with a court, the arbitrator must honor the terms of these Terms (and any Additional Terms) and can
					award the prevailing party damages and other relief (including attorneys’ fees). However, WITH
					ARBITRATION (A) THERE IS NO JUDGE OR JURY, (B) THE ARBITRATION PROCEEDINGS AND ARBITRATION OUTCOME
					ARE SUBJECT TO CERTAIN CONFIDENTIALITY RULES, AND (C) JUDICIAL REVIEW OF THE ARBITRATION OUTCOME IS
					LIMITED. All parties to the arbitration will have the right, at their own expense, to be represented
					by an attorney or other advocate of their choosing. If an in-person arbitration hearing is required,
					then it will be conducted in the “metropolitan statistical area” (as defined by the U.S. Census
					Bureau) where you are a resident at the time the Dispute is submitted to arbitration. You and we
					will pay the administrative and arbitrator’s fees and other costs in accordance with the applicable
					arbitration rules; but if applicable arbitration rules or laws require Musare to pay a greater
					portion or all of such fees and costs in order for this Section 14 to be enforceable, then Musare
					will have the right to elect to pay the fees and costs and proceed to arbitration, or to decline to
					do so and have the matter resolved through the courts. Discovery will be permitted pursuant to the
					applicable arbitration rules. The arbitrator’s decision must consist of a written statement stating
					the disposition of each claim of the Dispute, and must provide a statement of the essential findings
					and conclusions on which the decision and any award (if any) is based. Judgment on the arbitration
					decision and award (if any) may be entered in or by any court that has jurisdiction over the parties
					pursuant to Section 9 of the Federal Arbitration Act.</p>
				<p><b>C. Limited Time To File Claims.</b> TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IF YOU OR
					WE WANT TO ASSERT A DISPUTE (BUT NOT AN EXCLUDED DISPUTE) AGAINST THE OTHER, THEN YOU OR WE MUST
					COMMENCE IT (BY DELIVERY OF WRITTEN NOTICE AS SET FORTH IN SECTION 14.A) WITHIN ONE (1) YEAR AFTER
					THE DISPUTE ARISES – OR IT WILL BE FOREVER BARRED.</p>
				<p><b>D. Injunctive Relief.</b> The foregoing provisions of this Section 14 will not apply to any legal
					action taken by Musare to seek an injunction or other equitable relief in connection with, any loss,
					cost, or damage (or any potential loss, cost, or damage) relating to the Site, any Content, your
					User-Generated Content and/or Musare’s intellectual property rights (including such Musare may claim
					that may be in dispute), Musare’s operations, and/or Musare’s products or services.</p>
				<p><b>E. Small Claims Matters Are Excluded From Arbitration Requirement.</b> Notwithstanding the
					foregoing, either of us may bring qualifying claim of Disputes (but not Excluded Disputes) in small
					claims court, subject to Section 14.G.</p>
				<p><b>F. No Class Action Matters.</b> Disputes will be arbitrated only on an individual basis and will
					not be consolidated with any other arbitration or other proceedings that involve any claim or
					controversy of any other party. But if, for any reason, any court with competent jurisdiction or any
					arbitrator selected pursuant to Section 14.B(i) holds that this restriction is unconscionable or
					unenforceable, then our agreement in Section 14.B to arbitrate will not apply and the Dispute must
					be brought exclusively in court pursuant to Section 14.G.</p>
				<p><b>G. Federal and State Courts in Los Angeles.</b> Except to the extent that arbitration is required
					in Section 14.B, and except as to the enforcement of any arbitration decision or award, any action
					or proceeding relating to any Dispute or Excluded Dispute may only be instituted in state or federal
					court in Los Angeles County, California. Accordingly, you and Musare consent to the exclusive
					personal jurisdiction and venue of such courts for such matters.</p>

				<h4>15. Waiver of Injunctive or Other Equitable Relief</h4>
				<p>IF YOU CLAIM THAT YOU HAVE INCURRED ANY LOSS, DAMAGES, OR INJURIES IN CONNECTION WITH YOUR USE OF THE
					SITE, THEN THE LOSSES, DAMAGES, AND INJURIES WILL NOT BE IRREPARABLE OR SUFFICIENT TO ENTITLE YOU TO
					AN INJUNCTION OR TO OTHER EQUITABLE RELIEF OF ANY KIND. THIS MEANS THAT, IN CONNECTION WITH YOUR
					CLAIM, YOU AGREE THAT YOU WILL NOT SEEK, AND THAT YOU WILL NOT BE PERMITTED TO OBTAIN, ANY COURT OR
					OTHER ACTION THAT MAY INTERFERE WITH OR PREVENT THE DEVELOPMENT OR EXPLOITATION OF ANY WEBSITE,
					APPLICATION, CONTENT, USER-GENERATED CONTENT, PRODUCT, SITE, OR INTELLECTUAL PROPERTY OWNED,
					LICENSED, USED OR CONTROLLED BY MUSARE (INCLUDING YOUR LICENSED USER-GENERATED CONTENT) OR A
					LICENSOR OF MUSARE.</p>

				<h4>16. Force Majeure</h4>
				<p>You agree that we are not responsible to you for anything that we may otherwise be responsible for,
					if it is the result of events beyond our control, including, but not limited to, acts of God, war,
					insurrection, riots, terrorism, crime, labor shortages (including lawful and unlawful strikes), any
					third party site being down, communication disruption, failure or shortage of infrastructure, zombie
					attacks, shortage of materials, or any other event beyond our control.</p>

				<h4>17. Cancellation of Service</h4>
				<p>You agree that we may cancel our service or the Site at any time, for any reason, without warning or
					compensation, even if we have been advised that it may result in a loss to you or any other
					party.</p>

				<h4>18. Severability</h4>
				<p>In the event that a provision of this Agreement is found to be unlawful or otherwise unenforceable,
					the Agreement will remain in force as though it had been entered into without that unlawful or
					unenforceable provision being included in it.</p>

				<h4>19. Update to Terms</h4>
				<p>These Terms (or if applicable Additional Terms), in the form posted at the time of your use of the
					Site to which it applies, shall govern such use (including transactions entered during such use). AS
					OUR SITE EVOLVES, THE TERMS AND CONDITIONS UNDER WHICH WE OFFER THE SITE MAY PROSPECTIVELY BE
					MODIFIED AND WE MAY CEASE OFFERING THE SITE UNDER THE TERMS OR ADDITIONAL TERMS FOR WHICH THEY WERE
					PREVIOUSLY OFFERED. ACCORDINGLY, EACH TIME YOU SIGN IN TO OR OTHERWISE USE THE SITE YOU ARE ENTERING
					INTO A NEW AGREEMENT WITH US ON THE THEN APPLICABLE TERMS AND CONDITIONS AND YOU AGREE THAT WE MAY
					NOTIFY YOU OF OTHER TERMS BY POSTING THEM ON THE SITE (OR IN ANY OTHER REASONABLE MANNER OF NOTICE
					WHICH WE ELECT), AND THAT YOUR USE OF THE SITE AFTER SUCH NOTICE CONSTITUTES YOUR GOING FORWARD
					AGREEMENT TO THE OTHER TERMS FOR YOUR NEW USE AND TRANSACTIONS. Therefore, you should review the
					posted terms of Site and any applicable Additional Terms each time you use the Site (at least prior
					to each transaction or submission). The Additional Terms will be effective as to new use and
					transactions as of the time that we post them, or such later date as may be specified in them or in
					other notice to you. However, the Terms (and any applicable Additional Terms) that applied when you
					previously used the Site will continue to apply to such prior use (i.e., changes and additions are
					prospective only) unless mutually agreed. In the event any notice to you of new, revised or
					additional terms is determined by a tribunal to be insufficient, the prior agreement shall continue
					until sufficient notice to establish a new agreement occurs. You should frequently check the home
					page, your message account and the e-mail you associated with your account for notices, all of which
					you agree are reasonable manners of providing you notice. You can reject any new, revised or
					Additional Terms by discontinuing use of the Site and related services.</p>

				<h4>20. Investigations; Cooperation with Law Enforcement; Termination; Survival</h4>
				<p>Musare reserves the right, without any limitation, to: (i) investigate any suspected breaches of its
					Site security or its information technology or other systems or networks, (ii) investigate any
					suspected breaches of these Terms and any Additional Terms, (iii) investigate any information
					obtained by Musare in connection with reviewing law enforcement databases or complying with criminal
					laws, (iv) involve and cooperate with law enforcement authorities in investigating any of the
					foregoing matters, (v) prosecute violators of these Terms and any Additional Terms, and (vi)
					discontinue the Site, in whole or in part, or, except as may be expressly set forth in any
					Additional Terms, suspend or terminate your access to it, in whole or in part, including any user
					accounts or registrations, at any time, without notice, for any reason and without any obligation to
					you or any third party. Any suspension or termination will not affect your obligations to Musare
					under these Terms or any Additional Terms. Upon suspension or termination of your access to the
					Site, or upon notice from Musare, all rights granted to you under these Terms or any Additional
					Terms will cease immediately, and you agree that you will immediately discontinue use of the Site.
					The provisions of these Terms and any Additional Terms, which by their nature should survive your
					suspension or termination will survive, including the rights and licenses you grant to Musare in
					these Terms, as well as the indemnities, releases, disclaimers, and limitations on liability and the
					provisions regarding jurisdiction, choice of law, no class action, and mandatory arbitration.</p>
			</main>
		);
	}
}
