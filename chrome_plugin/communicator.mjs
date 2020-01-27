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

/*
Websocket Communicator.
(C) 2019 Optofidelity.

Usage:
    var host = "127.0.0.1";
    var port = 50009;
    var dut_name = "DUT1";
    var application = new Application( dut_name );
    var communicator = new Communicator( host, port, application );
    communicator.start()

Application instance must have dictionary called "commands"
    commands must have key for every command in API.
    commands must have functions for every key, taking in (json-originated) parameters.
    command functions must return a (json-formattable) value.
*/

export function Communicator( host, port, application )
    {
    //
    // port: Websocket port of the server.
    // application: Application instance.
    //
    console.log("Communicator init");
    this.host = host;
    this.port = port;
    this.application = application;
    this.buffer = "";
    this.socket = null;
    this.commands = {};
    }

Communicator.prototype.handleCmd = function( cmd )
    {
    //
    // Handle a command
    // IN: "command_name" + " " + "json-formatted parameters" + "\n"
    // OUT:
    //      "ok " + json formatted response
    //      "error " + error message string.

    if( cmd == "" ) return;

    var params = [];
    var p = cmd.indexOf(' ');
    if( p >= 0 )
        {
        params = cmd.substr( p + 1 )
        cmd = cmd.substr( 0, p );
        }
    cmd = cmd.toLowerCase()

    var rv = "";

    try
        {
        var command = this.application.commands[ cmd ];
        if( command )
            {
            if( params.length )
                {
                params = JSON.parse( params );
                }
            var response = command( params );
            response = JSON.stringify( response );
            rv = "ok " + response;
            }

        else
            {
            rv = 'error';
            }
        }
    catch( err )
        {
        console.log( err );
        rv = 'error ' + err;
        }
    return rv;
    }

Communicator.prototype.start = function()
    {
    var s = new WebSocket("ws://" + this.host + ":" + this.port + "/");
    s.onopen = function(e)
        {
        console.log("opened");
        this.buffer = "";
        }
    s.onclose = function(e) { console.log("closed"); }
    s.onmessage = this.onmessage.bind( this );
    this.socket = s;
    };

Communicator.prototype.onmessage = function(e)
    {
    this.buffer += e.data;

    // messages split with newline

    var p = this.buffer.search("\n");
    if( p < 0 )
        {
        return;
        }
    var msg = this.buffer.substr( 0, p );
    this.buffer = this.buffer.substr( p+1 );

    var cmds = msg.trim().split('\n');
    var rv = "";
    for( var i=0; i<cmds.length; i++ )
        {
        var cmd = cmds[ i ];
        rv += this.handleCmd( cmd );
        rv += '\n';
        }

    // always respond
    this.socket.send(rv)
    }

