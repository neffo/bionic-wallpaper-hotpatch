/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */

const Background = imports.ui.background.Background;
const BackgroundManager = imports.ui.background.BackgroundManager;
var _Background_destroy = Background.prototype._destroy;
var _BackgroundManager_swapBackgroundActor = BackgroundManager.prototype._swapBackgroundActor;
const ExtensionUtils = imports.misc.extensionUtils;
const Convenience = Me.imports.convenience;

var debug = true;

function log(msg) {
    if (debug)
        print("bionichotpatch extension " + msg); // disable to keep the noise down in journal
}

class Extension {
    constructor() {
    }

    enable() {
        if (Convenience.currentVersionSmaller('3.33.3')) {
            log('enabled on ' + ExtensionUtils.getCurrentExtension());
            Background.prototype._destroy = patched_background_destroy;
            BackgroundManager.prototype._swapBackgroundActor = patched_backgroundmanager_swapBackgroundActor;
        }
    }

    disable() {
        if (Convenience.currentVersionSmaller('3.33.3')) {
            log('enabled on ' + ExtensionUtils.getCurrentExtension());
            Background.prototype._destroy = _Background_destroy;
            BackgroundManager.prototype._swapBackgroundActor = _BackgroundManager_swapBackgroundActor;
        }
    }
}

function init() {
    return new Extension();
}

// there are the patched versions of the two functions

function patched_background_destroy() {
    this.background = null;

    this._cancellable.cancel();
    this._removeAnimationTimeout();

    let i;
    let keys = Object.keys(this._fileWatches);
    for (i = 0; i < keys.length; i++) {
        this._cache.disconnect(this._fileWatches[keys[i]]);
    }
    this._fileWatches = null;

    if (this._timezoneChangedId != 0)
        this._clock.disconnect(this._timezoneChangedId);
    this._timezoneChangedId = 0;

    this._clock = null;

    if (this._prepareForSleepId != 0)
        LoginManager.getLoginManager().disconnect(this._prepareForSleepId);
    this._prepareForSleepId = 0;

    if (this._settingsChangedSignalId != 0)
        this._settings.disconnect(this._settingsChangedSignalId);
    this._settingsChangedSignalId = 0;
}

function patched_backgroundmanager_swapBackgroundActor() {
    let oldBackgroundActor = this.backgroundActor;
    this.backgroundActor = this._newBackgroundActor;
    this._newBackgroundActor = null;
    this.emit('changed');

    Tweener.addTween(oldBackgroundActor,
        { opacity: 0,
        time: FADE_ANIMATION_TIME,
        transition: 'easeOutQuad',
        onComplete() {
            oldBackgroundActor.destroy();
        }
    });
}
