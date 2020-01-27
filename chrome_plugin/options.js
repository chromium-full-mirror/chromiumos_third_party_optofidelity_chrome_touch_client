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


let page = document.getElementById('buttonDiv');

function constructOptions()
    {
    function createOption( label, type, variable_name )
        {
        let group = document.createElement( "div" );

        let labelDiv = document.createElement( "div" );
        labelDiv.innerHTML = label;
        labelDiv.className = "option_label";

        group.append( labelDiv );

        let inputDiv = document.createElement( "input" );
        inputDiv.setAttribute( "input-type", type );
        inputDiv.className = "option_input";

        group.appendChild( inputDiv );

        group.style.background = "linear-gradient(transparent, rgba(0,0,0,0.1))";

        page.appendChild( group );

        chrome.storage.local.get([variable_name], function(result)
            {
            console.log( "hoi", result );
            inputDiv.value = result[variable_name];
            });

        inputDiv.onchange = function( e )
            {
            chrome.storage.local.set({[variable_name]: inputDiv.value}, function()
                {
                console.log('Value of ' + variable_name + ' is set to ' + inputDiv.value);
                });
            }

        }

    createOption( "Server IP address", "text", "host" );
    createOption( "Server IP port", "number", "port" );
    createOption( "DUT name", "text", "name" );
    }
constructOptions();