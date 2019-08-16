package org.gome.search.utils;

import de.codecentric.boot.admin.client.registration.NetUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.LinkedList;
import java.util.List;

import static org.gome.search.utils.GUID.TimeUtil.tilNextMillis;
import static org.gome.search.utils.GUID.TimeUtil.timeGen;

public class GUID {

    protected static final Logger LOG = LoggerFactory.getLogger(GUID.class);

    private long workerId;
    private long datacenterId;
    private long sequence = 0L;

    private long workerIdBits = 8L;
    private long datacenterIdBits = 2L;
    private long maxWorkerId = -1L ^ (-1L << workerIdBits);
    private long maxDatacenterId = -1L ^ (-1L << datacenterIdBits);
    private long sequenceBits = 12L;

    private long workerIdShift = sequenceBits;
    private long datacenterIdShift = sequenceBits + workerIdBits;
    private long timestampLeftShift = sequenceBits + workerIdBits + datacenterIdBits;
    private long sequenceMask = -1L ^ (-1L << sequenceBits);
    private static char[] chars62={'0','1','2','3','4','5','6','7','8','9',
            'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z',
            'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'};

    private long lastTimestamp = -1L;

    public GUID(long workerId, long datacenterId) {
        // sanity check for workerId
        if (workerId > maxWorkerId || workerId < 0) {
            throw new IllegalArgumentException(String.format("worker Id can't be greater than %d or less than 0", maxWorkerId));
        }
        if (datacenterId > maxDatacenterId || datacenterId < 0) {
            throw new IllegalArgumentException(String.format("datacenter Id can't be greater than %d or less than 0", maxDatacenterId));
        }
        this.workerId = workerId;
        this.datacenterId = datacenterId;
        LOG.info(String.format("worker starting. timestamp left shift %d, datacenter id bits %d, worker id bits %d, sequence bits %d, workerid %d", timestampLeftShift, datacenterIdBits, workerIdBits, sequenceBits, workerId));
    }

    public synchronized long nextId() {
        long timestamp = timeGen();

        if (timestamp < lastTimestamp) {
            LOG.error(String.format("clock is moving backwards.  Rejecting requests until %d.", lastTimestamp));
            throw new RuntimeException(String.format("Clock moved backwards.  Refusing to generate id for %d milliseconds", lastTimestamp - timestamp));
        }

        if (lastTimestamp == timestamp) {
            sequence = (sequence + 1) & sequenceMask;
            if (sequence == 0) {
                timestamp = tilNextMillis(lastTimestamp);
            }
        } else {
            sequence = 0L;
        }

        lastTimestamp = timestamp;

        return (timestamp << timestampLeftShift) | (datacenterId << datacenterIdShift) | (workerId << workerIdShift) | sequence;
    }

    public synchronized String nextId62Str(){
        long num=nextId();
        List<Integer> mods=new LinkedList<>();
        while (true){
            long div=num/chars62.length;
            int mod= (int) (num%chars62.length);
            mods.add(mod);
            if (div==0)
                break;
            num=div;
        }
        String result = "";
        for (Integer mod : mods) {
            result=chars62[mod]+result;
        }
        return result;
    }

    static class TimeUtil {
        public static long twepoch = 1288834974657L;

        public static long timeGen() {
            return System.currentTimeMillis() - twepoch;
        }
        public static long tilNextMillis(long lastTimestamp) {
            long timestamp = timeGen();
            while (timestamp <= lastTimestamp) {
                timestamp = timeGen();
            }
            return timestamp;
        }
    }


    public static void main(String[] args) {
        String ip= NetUtils.getLocalAddress().getHostAddress();

        GUID id=new GUID(Integer.parseInt(ip.split("\\.")[3]),1);
        for (int i=0;i<100;i++){
            System.out.println(id.nextId62Str());
        }
    }


}