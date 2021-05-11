/**
*	@filename	IPHunter.js
*	@author		kolton, Mercoory
*	@desc		search for a "hot" IP and stop if the correct server is found
*	@changes	2020.01 - more beeps and movements (anti drop measure) when IP is found; overhead messages with countdown timer; logs to D2Bot console
*/

function IPHunter() {
	let ip = Number(me.gameserverip.split(".")[3]);

	let startProfileIndex = 0, startProfileTick = getTickCount();

	this.otherHunterStaying = function () {
		var party = getParty();

		if (party) {
			do {
				if (party.name !== me.name && Config.IPHunter.TeamHunters.indexOf(party.name) > -1) {
					return true;
				}
			} while (party.getNext());
		}

		return false;
	};

	if (Config.IPHunter.IPList.indexOf(ip) > -1) {
		D2Bot.printToConsole("IPHunter: IP found! - [" + ip + "] Game is : " + me.gamename + (me.gamepassword ? ("//" + me.gamepassword) : ""), 7);
		print("IP found! - [" + ip + "] Game is : " + me.gamename + (me.gamepassword ? ("//" + me.gamepassword) : ""));
		me.overhead(":D IP found! - [" + ip + "]");
		me.maxgametime = 0;

		for (let i = 12; i > 0; i -= 1) {
			me.overhead(":D IP found! - [" + ip + "]" + (i - 1) + " beep left");
			beep(); // works if windows sounds are enabled
			delay(250);
		}

		while (true) {

			/* // remove comment if you want beeps at every movement
			for (let i = 12; i != 0; i -= 1) {
				me.overhead(":D IP found! - [" + ip + "]" + (i-1) + " beep left");
				beep(); // works if windows sounds are enabled
				delay(250);
			}
			*/

			me.overhead(":D IP found! - [" + ip + "]");

			// move on if another hunter is here
			if (this.otherHunterStaying()) {
				return true;
			}

			try {
				if (me.getQuest(7, 0)) { // able to go to a2
					Town.goToTown(2);
				}

				Town.move("waypoint");
				Town.move("stash");
			} catch (e) {
				// ensure it doesnt leave game by failing to walk due to desyncing.
			}

			for (let i = (12 * 60); i > 0; i -= 1) {
				if (this.otherHunterStaying()) { // continue scripts if another bot arrives
					return true;
				}

				// start other profiles if another hunter is not here
				if (startProfileIndex < Config.IPHunter.StartProfiles.length && getTickCount() > startProfileTick) {
					D2Bot.start(Config.IPHunter.StartProfiles[startProfileIndex]);
					startProfileTick = getTickCount() + 60 * 1e3; // wait 60s before starting next
					startProfileIndex += 1;
				}

				me.overhead(":D IP found! - [" + ip + "] Next movement in: " + i + " sec.");
				delay(1000);
			}
		}
	}

	for (let i = (Config.IPHunter.GameLength * 60); i > 0; i -= 1) {
		me.overhead(":( IP : [" + (ip) + "] NG: " + i + " sec");
		delay(1000);
	}

	D2Bot.printToConsole("IPHunter: IP for [" + me.gamename + "] was [" + ip + "]", 10);

	return true;
}