/*
Copyright (c) 2019, OptoFidelity OY

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

    1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
    3. All advertising materials mentioning features or use of this software must display the following acknowledgement: This product includes software developed by the OptoFidelity OY.
    4. Neither the name of the OptoFidelity OY nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

function Start()
    {
    var canvas = document.getElementById( "infotainment" );
    var b = document.getElementById("fullscreenbutton")

    b.onclick = function(e)
        {
        document.documentElement.webkitRequestFullscreen();
        };

    canvas.onmousemove = function( e )
        {
        if( e.button == 0 )
            {
            if( canvas.width != canvas.clientWidth || canvas.height != canvas.clientHeight )
                {
                canvas.width = canvas.clientWidth;
                canvas.height = canvas.clientHeight;
                }

            var c = canvas.getContext( "2d" );


            var x = e.clientX;
            var y = e.clientY;
            c.fillRect( x-2, y-2, 4, 4 );
            }
        }
    }


// Start();

import { Application } from './application.mjs';
import { Communicator } from './communicator.mjs';


function DoStart()
    {
    function Starter()
        {
        this.host = null;
        this.port = null;
        this.name = null;

        chrome.storage.local.get(["host"], this.gethost.bind(this));
        chrome.storage.local.get(["port"], this.getport.bind(this));
        chrome.storage.local.get(["name"], this.getname.bind(this));
        }

    Starter.prototype.gethost = function( result )
        {
        this.host = result["host"]
        console.log( "got host " + this.host );
        this.tryStart();
        }

    Starter.prototype.getport = function( result )
        {
        this.port = result["port"]
        console.log( "got port " + this.port );
        this.tryStart();
        }

    Starter.prototype.getname = function( result )
        {
        this.name = result["name"]
        console.log( "got name " + this.name );
        this.tryStart();
        }

    Starter.prototype.tryStart = function()
        {
        if( this.host && this.port && this.name )
            {
            var testapp_application = new Application(this.name);
            var testapp_communicator = new Communicator( this.host, this.port, testapp_application );
            testapp_communicator.start();
            }
        }

    var b = document.getElementById("fullscreenbutton")
    b.onclick = function(e)
        {
        document.documentElement.webkitRequestFullscreen();
        };

    var testapp_starter = new Starter();
    }

DoStart();