package org.gome.search.trace;

import com.github.kristofa.brave.*;
import com.github.kristofa.brave.kafka.KafkaSpanCollector;
import com.twitter.zipkin.gen.Endpoint;
import org.gome.search.domain.StoreConfiguration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.stereotype.Component;

import java.io.Closeable;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Random;

/**
 * Created by doujintong on 17-3-21.
 */
@Component
public class BraveTrace implements Closeable{

    private static boolean isTrace=true;

    public static ThreadLocal<SpanId> currentSpan=new ThreadLocal<>();

    private StoreConfiguration storeConfiguration;

    private Brave brave;

    private KafkaSpanCollector kafkaSpanCollector;

    public BraveTrace(@Autowired StoreConfiguration storeConfiguration){
        this.storeConfiguration=storeConfiguration;
        if(storeConfiguration.isAbleTrace()){
            init();
        }

    }


    public void init(){
        kafkaSpanCollector=KafkaSpanCollector.create(storeConfiguration.getKafka(), new EmptySpanCollectorMetricsHandler());
        brave = new Brave.Builder("web_service").
                spanCollector(kafkaSpanCollector)
                .build();
    }


    public void traceBServer(long traceId,long parentId,String spanName) {
        if(isTrace!=true || traceId==0)return;
        brave.serverRequestInterceptor().handle(new ServerRequestAdapterImpl(traceId, parentId, spanName));
    }

    public void traceEServer(long traceId){
        if(isTrace!=true || traceId==0)return;
        brave.serverResponseInterceptor().handle(new ServerResponseAdapterImpl());
    }

    public void traceBClient(long traceId,String spanName) {
        if(isTrace!=true || traceId==0)return;
        brave.clientRequestInterceptor().handle(new ClientRequestAdapterImpl(spanName));
    }

    public void traceEClient(long traceId){
        if(isTrace!=true || traceId==0)return;
        brave.clientResponseInterceptor().handle(new ClientResponseAdapterImpl());
    }

    @Override
    public void close() throws IOException {
        kafkaSpanCollector.close();
        kafkaSpanCollector=null;
        brave=null;
    }

    static class ServerRequestAdapterImpl implements ServerRequestAdapter {

        Random randomGenerator = new Random();
        SpanId spanId;
        String spanName;

        ServerRequestAdapterImpl(long traceId,long parentId,String spanName){
            this.spanName = spanName;
            long startId = randomGenerator.nextLong();
            if(traceId==-1)traceId=randomGenerator.nextLong();
            SpanId spanId = SpanId.builder().spanId(startId).traceId(traceId).parentId(parentId).build();
            if(parentId==-1)spanId.toSpan().setParent_id(null);
            this.spanId = spanId;
            currentSpan.set(spanId);
        }

        @Override
        public TraceData getTraceData() {
            if (this.spanId != null) {
                return TraceData.builder().spanId(this.spanId).build();
            }
            long startId = randomGenerator.nextLong();
            SpanId spanId = SpanId.builder().spanId(startId).traceId(startId).parentId(startId).build();
            return TraceData.builder().spanId(spanId).build();
        }

        @Override
        public String getSpanName() {
            return spanName;
        }

        @Override
        public Collection<KeyValueAnnotation> requestAnnotations() {
            Collection<KeyValueAnnotation> collection = new ArrayList<KeyValueAnnotation>();
            return collection;
        }

    }

    static class ServerResponseAdapterImpl implements ServerResponseAdapter {

        @Override
        public Collection<KeyValueAnnotation> responseAnnotations() {
            Collection<KeyValueAnnotation> collection = new ArrayList<KeyValueAnnotation>();
            return collection;
        }
    }

    static class ClientRequestAdapterImpl implements ClientRequestAdapter {

        String spanName;
        SpanId spanId;

        ClientRequestAdapterImpl(String spanName){
            this.spanName = spanName;
        }

        public SpanId getSpanId() {
            return spanId;
        }

        @Override
        public String getSpanName() {
            return this.spanName;
        }

        @Override
        public void addSpanIdToRequest(SpanId spanId) {
            if (spanId != null) {
                this.spanId = spanId;
                currentSpan.set(spanId);
                //System.out.println(String.format("trace_id=%s, parent_id=%s, span_id=%s", spanId.traceId, spanId.parentId, spanId.spanId));
            }
        }

        @Override
        public Collection<KeyValueAnnotation> requestAnnotations() {
            Collection<KeyValueAnnotation> collection = new ArrayList<KeyValueAnnotation>();
            return collection;
        }

        @Override
        public Endpoint serverAddress() {
            return null;
        }

    }

    static class ClientResponseAdapterImpl implements ClientResponseAdapter {

        @Override
        public Collection<KeyValueAnnotation> responseAnnotations() {
            Collection<KeyValueAnnotation> collection = new ArrayList<KeyValueAnnotation>();
            return collection;
        }

    }


}
