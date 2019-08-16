#!/bin/sh


APP_PORT=8080

case "$2" in
'8070')
APP_PORT=8070
;;
'8080')
APP_PORT=8080
;;
'8090')
APP_PORT=8090
;;
*)
echo "Usage: use port {8070,8080,8090}"
exit 1
esac
echo "Use port $APP_PORT"

RUNNING_USER=root
APP_HOME=/workspace/gateway
APP_MAINCLASS=org.gome.search.GatewayApp
CLASSPATH=$APP_HOME/$APP_PORT:/$APP_HOME/conf
for i in "$APP_HOME"/lib/*.jar; do
CLASSPATH="$CLASSPATH":"$i"
done
export MALLOC_CHECK_=0

JAVA_OPTS="-server -Xmx6092m -Xms6092m -Djava.awt.headless=true -Dapp.port=$APP_PORT -Dproperty.leveldb.path=/app/logs/gateway/cache$APP_PORT/ -Djava.security.egd=file:/dev/./urandom"
#JMX="-Dcom.sun.management.jmxremote.port=9999 -Dcom.sun.management.jmxremote.ssl=false -Dcom.sun.management.jmxremote.authenticate=false"
psid=0

checkpid()
{
javaps=`/bin/ps -ef |grep java |grep $APP_HOME |grep $APP_PORT`
if [ -n "$javaps" ]; then
psid=`echo $javaps | awk '{print $2}'`
else
psid=0
fi
echo "psid=$psid"
}


start()
{
checkpid
if [ $psid -ne 0 ]; then
echo "================================"
echo "warn: $APP_MAINCLASS already started! (pid=$psid)"
echo "================================"
else
echo -n "Starting $APP_MAINCLASS ..."
JAVA_CMD="nohup java $JAVA_OPTS  -classpath $CLASSPATH $APP_MAINCLASS --port=$APP_PORT >/app/logs/gateway/gateway$APP_PORT.log 2>&1 </dev/null &"
su -c "$JAVA_CMD"
checkpid
if [ $psid -ne 0 ]; then
echo "(pid=$psid) [OK]"
else
echo "[Failed]"
fi
fi
}

stop()
{
checkpid
echo "stop process id is $psid"
if [ $psid -ne 0 ]; then
echo -n "Stopping $APP_MAINCLASS ...(pid=$psid) "
kill -9 $psid
if [ $? -eq 0 ]; then
echo "[OK]"
else
echo "[Failed]"
fi
checkpid
if [ $psid -ne 0 ]; then
 stop
fi
else
echo "================================"
echo "warn: $APP_MAINCLASS is not running"
echo "================================"
fi
}

status()
{
checkpid
if [ $psid -ne 0 ];  then
echo "$APP_MAINCLASS is running! (pid=$psid)"
else
echo "$APP_MAINCLASS is not running"
fi
}

info()
{
echo "System Information:"
echo "****************************"
echo `head -n 1 /etc/issue`
echo `uname -a`
echo
echo "JAVA_HOME=$JAVA_HOME"
echo `$JAVA_HOME/bin/java -version`
echo
echo "APP_HOME=$APP_HOME"
echo "APP_MAINCLASS=$APP_MAINCLASS"
echo "****************************"
}


case "$2" in
'8070')
APP_PORT=8070
;;
'8080')
APP_PORT=8080
;;
'8090')
APP_PORT=8090
;;
*)
echo "Usage: use port {8070,8080,8090}"
exit 1
esac


case "$1" in
'start')
start
;;
'stop')
stop
;;
'restart')
stop
start
;;
'status')
status
;;
'info')
info
;;
*)
echo "Usage: $0 {start|stop|restart|status|info}"
exit 1
esac
exit 0

