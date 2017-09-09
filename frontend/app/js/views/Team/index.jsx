import React, {Component} from "react";
import PropTypes from "prop-types";
import {translate} from "react-i18next";

@translate(["team"], {wait: true})
export default class Team extends Component {
	static propTypes = {
		t: PropTypes.func,
	};

	static defaultProps = {
		t: () => {
		},
	};

	render() {
		const { t } = this.props;

		return (
			<main id="team">
				<h1>{t("team:title")}</h1>

				<div className="current-members">
					<div className="current-member">
						<img className="picture" src="/assets/images/notes-transparent.png"/>
						<div className="lines">
							<span className="name">Kristian Vos</span>
							<span className="line"><b>Role:</b> <span>Founder - Developer - Designer</span></span>
							<span className="line"><b>Joined:</b> <span>September 23, 2015</span></span>
							<span className="line"><b>Email:</b> <span><a href="mailto:&#107;&#114;&#105;&#115;&#064;&#109;&#117;&#115;&#097;&#114;&#101;&#046;&#099;&#111;&#109;">kris@musare.com</a></span></span>
						</div>
						<div className="background"/>
					</div>
					<div className="current-member">
						<img className="picture" src="/assets/images/notes-transparent.png"/>
						<div className="lines">
							<span className="name">Owen Diffey</span>
							<span className="line"><b>Role:</b> <span>Community manager</span></span>
							<span className="line"><b>Joined:</b> <span>February 29, 2016</span></span>
							<span className="line"><b>Email:</b> <span><a href="mailto:&#111;&#119;&#101;&#110;&#064;&#109;&#117;&#115;&#097;&#114;&#101;&#046;&#099;&#111;&#109;">owen@musare.com</a></span></span>
						</div>
						<div className="background"/>
					</div>
					<div className="current-member">
						<img className="picture" src="/assets/images/notes-transparent.png"/>
						<div className="lines">
							<span className="name">Antonio</span>
							<span className="line"><b>Role:</b> <span>Lead-Moderator</span></span>
							<span className="line"><b>Joined:</b> <span>November 11, 2015</span></span>
							<span className="line"><b>Email:</b> <span><a href="mailto:&#097;&#110;&#116;&#111;&#110;&#105;&#111;&#064;&#109;&#117;&#115;&#097;&#114;&#101;&#046;&#099;&#111;&#109;">antonio@musare.com</a></span></span>
						</div>
						<div className="background"/>
					</div>
					<div className="current-member">
						<img className="picture" src="/assets/images/notes-transparent.png"/>
						<div className="lines">
							<span className="name">Johannes Andersen</span>
							<span className="line"><b>Role:</b> <span>Moderator</span></span>
							<span className="line"><b>Joined:</b> <span>September 23, 2015</span></span>
							<span className="line"><b>Email:</b> <span>None yet</span></span>
						</div>
						<div className="background"/>
					</div>
				</div>

				<h2>{ t("team:oldTeamMembers") }</h2>
				<div className="old-members">
					<div className="old-member">
						<span className="picture">
							<span className="initial">A</span>
						</span>
						<div className="lines">
							<span className="name">Adryd</span>
							<span className="line"><b>Role:</b> <span>Designer</span></span>
							<span className="line"><b>Joined:</b> <span>April 21, 2017</span></span>
						</div>
						<div className="background"/>
					</div>
					<div className="old-member">
						<span className="picture">
							<span className="initial">C</span>
						</span>
						<div className="lines">
							<span className="name">Cameron Kline</span>
							<span className="line"><b>Role:</b> <span>Developer</span></span>
							<span className="line"><b>Joined:</b> <span>August 26, 2016</span></span>
						</div>
						<div className="background"/>
					</div>
					<div className="old-member">
						<span className="picture">
							<span className="initial">W</span>
						</span>
						<div className="lines">
							<span className="name">Wesley McCann</span>
							<span className="line"><b>Role:</b> <span>Developer</span></span>
							<span className="line"><b>Joined:</b> <span>November 8, 2015</span></span>
						</div>
						<div className="background"/>
					</div>
					<div className="old-member">
						<span className="picture">
							<span className="initial">N</span>
						</span>
						<div className="lines">
							<span className="name">Nex</span>
							<span className="line"><b>Role:</b> <span>Developer</span></span>
							<span className="line"><b>Joined:</b> <span>February 26, 2016</span></span>
						</div>
						<div className="background"/>
					</div>
					<div className="old-member">
						<span className="picture">
							<span className="initial">A</span>
						</span>
						<div className="lines">
							<span className="name">Akira Laine</span>
							<span className="line"><b>Role:</b> <span>Founder - Developer</span></span>
							<span className="line"><b>Joined:</b> <span>February 23, 2015</span></span>
						</div>
						<div className="background"/>
					</div>
					<div className="old-member">
						<span className="picture">
							<span className="initial">A</span>
						</span>
						<div className="lines">
							<span className="name">Aaron Gildea</span>
							<span className="line"><b>Role:</b> <span>Moderator</span></span>
							<span className="line"><b>Joined:</b> <span>November 7, 2015</span></span>
						</div>
						<div className="background"/>
					</div>
				</div>
			</main>
		);
	}
}
