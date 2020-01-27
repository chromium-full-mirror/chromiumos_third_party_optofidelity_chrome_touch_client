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


export function Application( dut_name )
    {
    //
    // Application is the main logic of a websocket client.
    // Websocket Communicator needs an application instance to run.
    // Communicator will parse incoming messages and run functions from Application.
    // Functions take in command name and (json-formatted) parameters, return (json-formatted) response.
    //

    // register commands (this is the API for the application)
    this.name = dut_name;

    this.commands = {
                    "touches": this.cmd_touches.bind(this),
                    "draw_image": this.cmd_draw_image.bind(this),
                    "get_info": this.cmd_get_info.bind(this)
                    };

    // register event listeners for touch recording.
    var t = document.getElementById("infotainment")

    t.ontouchstart = this.mousedown.bind(this);
    t.ontouchmove = this.mousemove.bind(this);
    t.ontouchend = this.mouseup.bind(this);

    t.onmousedown = this.mousedown.bind(this);
    t.onmousemove = this.mousemove.bind(this);
    t.onmouseup = this.mouseup.bind(this);

    // set up touches array
    this.touches = [];

    // constants used in cmd_touches response. For each touch, store [touch_type, x, y]
    this.ACTION_DOWN = 0;
    this.ACTION_UP   = 1;
    this.ACTION_MOVE = 2;
    }

Application.prototype.cmd_touches = function(params)
    {
    //
    // touches command
    //
    var t = [];
    for( var i=0; i<this.touches.length; i++ )
        {
        var p = this.touches[ i ];
        t.push( p );
        }
    this.touches = [];
    return {"fields": ["action", "x", "y", "time", "id"], "touches": t};
    }

Application.prototype.cmd_draw_image = function(params)
    {
    //
    // draw image command
    //
    // params : dict {'image_data': base64 encoded image data (jpeg, png, etc.)}

    var image_data = params["image"];

    // resize canvas if needed
    if( infotainment.width != infotainment.clientWidth )
        {
        infotainment.width = infotainment.clientWidth;
        }

    if( infotainment.height != infotainment.clientHeight )
        {
        infotainment.height = infotainment.clientHeight;
        }

    var img = new Image();
    img.x0 = 0;
    img.y0 = 0;
    img.x1 = infotainment.clientWidth;
    img.y1 = infotainment.clientHeight;
    img.onload = this.imageLoaded.bind(this);
    img.src = "data:image/png;base64," + image_data;

    return ""
    }

Application.prototype.imageLoaded = function(e)
    {
    //
    // The async part of the draw image command.
    //
    var img = e.target;
    var c = infotainment.getContext( "2d" );

    c.drawImage( img, img.x0, img.y0, img.x1-img.x0, img.y1-img.y0 );
    }

Application.prototype.cmd_get_info = function(params)
    {
    //
    // Get info command. Return all needed info of the device under test.
    //
    var info = {
               "dut_name": this.name,
               "width": infotainment.clientWidth,
               "height": infotainment.clientHeight,
               "pixel_ratio": devicePixelRatio,
               "display_resolution": {"width": infotainment.clientWidth, "height": infotainment.clientHeight }
               };
    return info;
    }

Application.prototype.mousedown = function(e)
    {
    e.preventDefault();

    var ct = e.changedTouches;
    if( ct )
        {
        // touch events
        for( var i=0; i<ct.length; i++ )
            {
            var t = ct[ i ];
            this.touches.push([this.ACTION_DOWN, t.pageX, t.pageY, Math.floor(e.timeStamp), t.identifier]);
            }
        }
    else
        {
        // mouse events
        this.touches.push([this.ACTION_DOWN, e.pageX, e.pageY, Math.floor(e.timeStamp), 0]);
        }
    }

Application.prototype.mousemove = function(e)
    {
    e.preventDefault();

    var ct = e.changedTouches;
    if( ct )
        {
        // touch events
        for( var i=0; i<ct.length; i++ )
            {
            var t = ct[ i ];
            this.touches.push([this.ACTION_MOVE, t.pageX, t.pageY, Math.floor(e.timeStamp), t.identifier]);
            }
        }
    else
        {
        // mouse events
        this.touches.push([this.ACTION_MOVE, e.pageX, e.pageY, Math.floor(e.timeStamp), 0]);
        }
    }

Application.prototype.mouseup = function(e)
    {
    e.preventDefault();

    var ct = e.changedTouches;
    if( ct )
        {
        // touch events
        for( var i=0; i<ct.length; i++ )
            {
            var t = ct[ i ];
            this.touches.push([this.ACTION_UP, t.pageX, t.pageY, Math.floor(e.timeStamp), t.identifier]);
            }
        }
    else
        {
        // mouse events
        this.touches.push([this.ACTION_UP, e.pageX, e.pageY, Math.floor(e.timeStamp), 0]);
        }
    }

